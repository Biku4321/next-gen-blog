// server/src/services/abTestingService.js - Complete A/B Testing Implementation
import crypto from 'crypto';
import mongoose from 'mongoose'; 
import logger from '../utils/logger.js';
import { getRedisClient } from '../config/redis.js';
import Post from '../models/Post.js';
import Analytics from '../models/Analytics.js';

class ABTestingService {
  constructor() {
    this.activeTests = new Map();
    this.testResults = new Map();
  }

  async createTest(testConfig) {
    try {
      const {
        name,
        description,
        postId,
        variants,
        trafficSplit,
        metrics,
        duration,
        createdBy
      } = testConfig;

      const testId = this.generateTestId();
      const redis = getRedisClient();

      const test = {
        id: testId,
        name,
        description,
        postId,
        variants: variants.map((variant, index) => ({
          id: `variant_${index}`,
          name: variant.name,
          content: variant.content,
          title: variant.title,
          excerpt: variant.excerpt,
          featuredImage: variant.featuredImage,
          traffic: trafficSplit[index] || (100 / variants.length)
        })),
        metrics: metrics || ['views', 'engagement', 'conversion'],
        status: 'draft',
        startDate: null,
        endDate: null,
        duration, // in hours
        createdBy,
        createdAt: new Date(),
        results: {
          totalParticipants: 0,
          variantResults: {}
        },
        settings: {
          minSampleSize: 100,
          confidenceLevel: 0.95,
          statisticalSignificance: false
        }
      };

      // Initialize variant results
      test.variants.forEach(variant => {
        test.results.variantResults[variant.id] = {
          participants: 0,
          views: 0,
          engagement: 0,
          conversions: 0,
          conversionRate: 0,
          engagementRate: 0,
          bounceRate: 0,
          timeOnPage: 0
        };
      });

      // Store test in Redis
      await redis.setex(`ab_test:${testId}`, 86400 * 30, JSON.stringify(test));
      this.activeTests.set(testId, test);

      logger.info(`A/B test created: ${testId}`);
      return { success: true, testId, test };
    } catch (error) {
      logger.error('Create A/B test error:', error);
      throw error;
    }
  }

  async startTest(testId) {
    try {
      const test = await this.getTest(testId);
      if (!test) {
        throw new Error('Test not found');
      }

      test.status = 'running';
      test.startDate = new Date();
      test.endDate = new Date(Date.now() + test.duration * 60 * 60 * 1000);

      await this.saveTest(testId, test);

      // Schedule automatic test end
      setTimeout(async () => {
        await this.endTest(testId);
      }, test.duration * 60 * 60 * 1000);

      logger.info(`A/B test started: ${testId}`);
      return { success: true, test };
    } catch (error) {
      logger.error('Start A/B test error:', error);
      throw error;
    }
  }

  async getVariantForUser(testId, userId, sessionId) {
    try {
      const test = await this.getTest(testId);
      if (!test || test.status !== 'running') {
        return null;
      }

      // Check if user already assigned to a variant
      const redis = getRedisClient();
      const assignmentKey = `ab_assignment:${testId}:${userId || sessionId}`;
      let assignment = await redis.get(assignmentKey);

      if (assignment) {
        return JSON.parse(assignment);
      }

      // Assign user to variant based on traffic split
      const variantId = this.assignVariant(test.variants, userId || sessionId);
      const variant = test.variants.find(v => v.id === variantId);

      assignment = {
        testId,
        variantId,
        variant,
        assignedAt: new Date(),
        userId,
        sessionId
      };

      // Store assignment (expires when test ends)
      const ttl = Math.floor((new Date(test.endDate) - new Date()) / 1000);
      await redis.setex(assignmentKey, ttl, JSON.stringify(assignment));

      // Update participant count
      test.results.totalParticipants++;
      test.results.variantResults[variantId].participants++;
      await this.saveTest(testId, test);

      return assignment;
    } catch (error) {
      logger.error('Get variant for user error:', error);
      return null;
    }
  }

  assignVariant(variants, identifier) {
    // Use deterministic assignment based on identifier hash
    const hash = crypto.createHash('md5').update(identifier).digest('hex');
    const hashValue = parseInt(hash.substring(0, 8), 16);
    const percentage = (hashValue % 100) + 1;

    let cumulativeTraffic = 0;
    for (const variant of variants) {
      cumulativeTraffic += variant.traffic;
      if (percentage <= cumulativeTraffic) {
        return variant.id;
      }
    }

    // Fallback to first variant
    return variants[0].id;
  }

  async trackEvent(testId, variantId, eventType, eventData = {}) {
    try {
      const test = await this.getTest(testId);
      if (!test || test.status !== 'running') {
        return;
      }

      const variantResults = test.results.variantResults[variantId];
      if (!variantResults) {
        return;
      }

      // Update metrics based on event type
      switch (eventType) {
        case 'view':
          variantResults.views++;
          break;
        case 'engagement':
          variantResults.engagement++;
          break;
        case 'conversion':
          variantResults.conversions++;
          break;
        case 'bounce':
          // Track bounce events
          break;
        case 'time_on_page':
          if (eventData.timeSpent) {
            variantResults.timeOnPage = 
              (variantResults.timeOnPage + eventData.timeSpent) / 2;
          }
          break;
      }

      // Calculate rates
      if (variantResults.participants > 0) {
        variantResults.conversionRate = 
          (variantResults.conversions / variantResults.participants) * 100;
        variantResults.engagementRate = 
          (variantResults.engagement / variantResults.views) * 100;
      }

      await this.saveTest(testId, test);

      // Check if test reached statistical significance
      await this.checkStatisticalSignificance(testId);

    } catch (error) {
      logger.error('Track A/B test event error:', error);
    }
  }

  async checkStatisticalSignificance(testId) {
    try {
      const test = await this.getTest(testId);
      if (!test) return;

      const variants = Object.values(test.results.variantResults);
      
      // Need at least 2 variants and minimum sample size
      if (variants.length < 2 || 
          variants.some(v => v.participants < test.settings.minSampleSize)) {
        return;
      }

      // Simple chi-square test for conversion rates
      const isSignificant = this.calculateChiSquare(variants);
      
      if (isSignificant && !test.results.statisticalSignificance) {
        test.results.statisticalSignificance = true;
        test.results.significantAt = new Date();
        
        await this.saveTest(testId, test);
        
        // Optionally auto-end test when significance reached
        if (test.settings.autoEndOnSignificance) {
          await this.endTest(testId);
        }

        logger.info(`A/B test ${testId} reached statistical significance`);
      }
    } catch (error) {
      logger.error('Check statistical significance error:', error);
    }
  }

  calculateChiSquare(variants) {
    // Simplified chi-square test implementation
    // In production, use a proper statistics library
    
    const totalConversions = variants.reduce((sum, v) => sum + v.conversions, 0);
    const totalParticipants = variants.reduce((sum, v) => sum + v.participants, 0);
    
    if (totalParticipants === 0) return false;
    
    const expectedRate = totalConversions / totalParticipants;
    let chiSquare = 0;
    
    for (const variant of variants) {
      const expected = variant.participants * expectedRate;
      const observed = variant.conversions;
      
      if (expected > 0) {
        chiSquare += Math.pow(observed - expected, 2) / expected;
      }
    }
    
    // For 95% confidence level and df=1, critical value is 3.84
    return chiSquare > 3.84;
  }

  async endTest(testId) {
    try {
      const test = await this.getTest(testId);
      if (!test) return;

      test.status = 'completed';
      test.endDate = new Date();
      
      // Calculate final results
      const winner = this.determineWinner(test.results.variantResults);
      test.results.winner = winner;
      
      await this.saveTest(testId, test);
      
      // Optionally update the original post with winning variant
      if (winner && test.settings.autoApplyWinner) {
        await this.applyWinningVariant(test.postId, winner);
      }

      logger.info(`A/B test completed: ${testId}, Winner: ${winner?.id}`);
      return { success: true, test, winner };
    } catch (error) {
      logger.error('End A/B test error:', error);
      throw error;
    }
  }

  determineWinner(variantResults) {
    const variants = Object.entries(variantResults);
    
    if (variants.length === 0) return null;
    
    // Sort by conversion rate (or engagement rate if no conversions)
    variants.sort((a, b) => {
      const aRate = a[1].conversionRate || a[1].engagementRate;
      const bRate = b[1].conversionRate || b[1].engagementRate;
      return bRate - aRate;
    });
    
    return {
      id: variants[0][0],
      results: variants[0][1]
    };
  }

  async applyWinningVariant(postId, winner) {
    try {
      const test = await this.getTest(winner.testId);
      if (!test) return;

      const winningVariant = test.variants.find(v => v.id === winner.id);
      if (!winningVariant) return;

      // Update the original post with winning variant content
      await Post.findByIdAndUpdate(postId, {
        title: winningVariant.title,
        content: winningVariant.content,
        excerpt: winningVariant.excerpt,
        featuredImage: winningVariant.featuredImage
      });

      logger.info(`Applied winning variant ${winner.id} to post ${postId}`);
    } catch (error) {
      logger.error('Apply winning variant error:', error);
    }
  }

  async getTest(testId) {
    try {
      if (this.activeTests.has(testId)) {
        return this.activeTests.get(testId);
      }

      const redis = getRedisClient();
      const testData = await redis.get(`ab_test:${testId}`);
      
      if (testData) {
        const test = JSON.parse(testData);
        this.activeTests.set(testId, test);
        return test;
      }

      return null;
    } catch (error) {
      logger.error('Get A/B test error:', error);
      return null;
    }
  }

  async saveTest(testId, test) {
    try {
      const redis = getRedisClient();
      await redis.setex(`ab_test:${testId}`, 86400 * 30, JSON.stringify(test));
      this.activeTests.set(testId, test);
    } catch (error) {
      logger.error('Save A/B test error:', error);
      throw error;
    }
  }

  generateTestId() {
    return `test_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
  }

  async getAllTests(userId) {
    try {
      const redis = getRedisClient();
      const keys = await redis.keys('ab_test:*');
      const tests = [];

      for (const key of keys) {
        const testData = await redis.get(key);
        if (testData) {
          const test = JSON.parse(testData);
          // In production, filter by user permissions
          tests.push(test);
        }
      }

      return tests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      logger.error('Get all tests error:', error);
      throw error;
    }
  }

  async getTestAnalytics(testId) {
    try {
      const test = await this.getTest(testId);
      if (!test) return null;

      // Enhanced analytics with charts data
      const analytics = {
        overview: test.results,
        timeline: await this.getTestTimeline(testId),
        variantComparison: this.getVariantComparison(test.results.variantResults),
        recommendations: this.generateRecommendations(test)
      };

      return analytics;
    } catch (error) {
      logger.error('Get test analytics error:', error);
      throw error;
    }
  }

  async getTestTimeline(testId) {
    // Implementation to get timeline data from analytics
    // This would track how metrics evolved over time
    return [];
  }

  getVariantComparison(variantResults) {
    return Object.entries(variantResults).map(([id, results]) => ({
      variantId: id,
      ...results,
      confidence: this.calculateConfidence(results)
    }));
  }

  calculateConfidence(results) {
    // Statistical confidence calculation
    if (results.participants < 30) return 'low';
    if (results.participants < 100) return 'medium';
    return 'high';
  }

  generateRecommendations(test) {
    const recommendations = [];
    
    if (test.results.totalParticipants < test.settings.minSampleSize) {
      recommendations.push({
        type: 'warning',
        message: 'Test needs more participants for reliable results'
      });
    }

    if (test.results.statisticalSignificance) {
      recommendations.push({
        type: 'success',
        message: 'Test has reached statistical significance'
      });
    }

    return recommendations;
  }
}

export default new ABTestingService();
