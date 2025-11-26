// server/src/services/socialService.js - Complete Social Media Integration
import axios from 'axios';
import cron from 'node-cron';
import logger from '../utils/logger.js';
import { getRedisClient } from '../config/redis.js';
import Post from '../models/Post.js';
import geminiService from './geminiService.js';

class SocialMediaService {
  constructor() {
    this.platforms = {
      twitter: this.setupTwitter(),
      linkedin: this.setupLinkedIn(),
      facebook: this.setupFacebook(),
      instagram: this.setupInstagram()
    };

    // Start scheduled posting cron job
    this.startScheduler();
  }

  setupTwitter() {
    return {
      apiKey: process.env.TWITTER_API_KEY,
      apiSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,

      async postTweet(text, mediaIds = []) {
        try {
          const url = 'https://api.twitter.com/2/tweets';
          const payload = { text };
          
          if (mediaIds.length > 0) {
            payload.media = { media_ids: mediaIds };
          }

          const response = await axios.post(url, payload, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          return { success: true, data: response.data };
        } catch (error) {
          logger.error('Twitter post error:', error);
          return { success: false, error: error.message };
        }
      },

      async uploadMedia(imageBuffer) {
        try {
          const url = 'https://upload.twitter.com/1.1/media/upload.json';
          const formData = new FormData();
          formData.append('media', imageBuffer);

          const response = await axios.post(url, formData, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          });

          return response.data.media_id_string;
        } catch (error) {
          logger.error('Twitter media upload error:', error);
          return null;
        }
      }
    };
  }

  setupLinkedIn() {
    return {
      accessToken: process.env.LINKEDIN_ACCESS_TOKEN,
      personId: process.env.LINKEDIN_PERSON_ID,

      async postUpdate(text, imageUrl = null) {
        try {
          const url = 'https://api.linkedin.com/v2/ugcPosts';
          
          const payload = {
            author: `urn:li:person:${this.personId}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: { text },
                shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE'
              }
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
          };

          if (imageUrl) {
            payload.specificContent['com.linkedin.ugc.ShareContent'].media = [{
              status: 'READY',
              description: { text: 'Blog post featured image' },
              media: imageUrl,
              title: { text: 'Featured Image' }
            }];
          }

          const response = await axios.post(url, payload, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`,
              'Content-Type': 'application/json'
            }
          });

          return { success: true, data: response.data };
        } catch (error) {
          logger.error('LinkedIn post error:', error);
          return { success: false, error: error.message };
        }
      }
    };
  }

  setupFacebook() {
    return {
      accessToken: process.env.FACEBOOK_ACCESS_TOKEN,
      pageId: process.env.FACEBOOK_PAGE_ID,

      async postToPage(message, link = null, imageUrl = null) {
        try {
          const url = `https://graph.facebook.com/v18.0/${this.pageId}/feed`;
          
          const params = {
            message,
            access_token: this.accessToken
          };

          if (link) params.link = link;
          if (imageUrl) params.picture = imageUrl;

          const response = await axios.post(url, params);
          return { success: true, data: response.data };
        } catch (error) {
          logger.error('Facebook post error:', error);
          return { success: false, error: error.message };
        }
      }
    };
  }

  setupInstagram() {
    return {
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
      businessId: process.env.INSTAGRAM_BUSINESS_ID,

      async postPhoto(imageUrl, caption) {
        try {
          // First, create media object
          const createUrl = `https://graph.facebook.com/v18.0/${this.businessId}/media`;
          const createResponse = await axios.post(createUrl, {
            image_url: imageUrl,
            caption,
            access_token: this.accessToken
          });

          const mediaId = createResponse.data.id;

          // Then publish the media
          const publishUrl = `https://graph.facebook.com/v18.0/${this.businessId}/media_publish`;
          const publishResponse = await axios.post(publishUrl, {
            creation_id: mediaId,
            access_token: this.accessToken
          });

          return { success: true, data: publishResponse.data };
        } catch (error) {
          logger.error('Instagram post error:', error);
          return { success: false, error: error.message };
        }
      }
    };
  }

  async schedulePost(postId, platforms, scheduleTime, customMessage = null) {
    try {
      const post = await Post.findById(postId).populate('author');
      if (!post) {
        throw new Error('Post not found');
      }

      const redis = getRedisClient();
      const scheduleData = {
        postId,
        platforms,
        scheduleTime,
        customMessage,
        post: {
          title: post.title,
          excerpt: post.excerpt,
          slug: post.slug,
          featuredImage: post.featuredImage?.url,
          author: post.author.username
        },
        status: 'scheduled',
        createdAt: new Date()
      };

      // Store in Redis with expiration
      const scheduleKey = `social_schedule:${postId}:${Date.now()}`;
      await redis.setex(scheduleKey, 86400 * 30, JSON.stringify(scheduleData)); // 30 days

      // Add to schedule queue
      await redis.lpush('social_queue', scheduleKey);

      logger.info(`Social media post scheduled for ${scheduleTime}`);
      return { success: true, scheduleKey };
    } catch (error) {
      logger.error('Schedule post error:', error);
      throw error;
    }
  }

  async publishToAllPlatforms(post, platforms, customMessage = null) {
    const results = {};
    
    for (const platform of platforms) {
      try {
        const result = await this.publishToPlatform(post, platform, customMessage);
        results[platform] = result;
      } catch (error) {
        logger.error(`${platform} publish error:`, error);
        results[platform] = { success: false, error: error.message };
      }
    }

    return results;
  }

  async publishToPlatform(post, platform, customMessage = null) {
    const service = this.platforms[platform];
    if (!service) {
      throw new Error(`Platform ${platform} not supported`);
    }

    // Generate platform-specific content
    let content;
    if (customMessage) {
      content = customMessage;
    } else {
      const socialPosts = await geminiService.generateSocialPosts(
        post.title, 
        post.excerpt, 
        [platform]
      );
      content = socialPosts[platform] || `Check out my latest blog post: ${post.title}`;
    }

    const postUrl = `${process.env.FRONTEND_URL}/posts/${post.slug}`;

    switch (platform) {
      case 'twitter':
        // Twitter character limit handling
        const twitterContent = this.truncateForTwitter(content, postUrl);
        return await service.postTweet(twitterContent);

      case 'linkedin':
        const linkedInContent = `${content}\n\nRead more: ${postUrl}`;
        return await service.postUpdate(linkedInContent, post.featuredImage?.url);

      case 'facebook':
        return await service.postToPage(
          content, 
          postUrl, 
          post.featuredImage?.url
        );

      case 'instagram':
        if (post.featuredImage?.url) {
          const instagramCaption = `${content}\n\nLink in bio to read the full article!\n\n#blogging #contentcreator #writing`;
          return await service.postPhoto(post.featuredImage.url, instagramCaption);
        } else {
          throw new Error('Instagram requires an image');
        }

      default:
        throw new Error(`Platform ${platform} not implemented`);
    }
  }

  truncateForTwitter(content, url) {
    const maxLength = 280 - url.length - 3; // Account for URL and spacing
    if (content.length <= maxLength) {
      return `${content} ${url}`;
    }
    return `${content.substring(0, maxLength - 3)}... ${url}`;
  }

  startScheduler() {
    // Check for scheduled posts every minute
    cron.schedule('* * * * *', async () => {
      try {
        const redis = getRedisClient();
        const queueKeys = await redis.lrange('social_queue', 0, -1);
        
        for (const key of queueKeys) {
          const scheduleData = await redis.get(key);
          if (!scheduleData) continue;

          const schedule = JSON.parse(scheduleData);
          const scheduleTime = new Date(schedule.scheduleTime);
          
          if (scheduleTime <= new Date() && schedule.status === 'scheduled') {
            // Time to publish
            try {
              const results = await this.publishToAllPlatforms(
                schedule.post,
                schedule.platforms,
                schedule.customMessage
              );

              // Update status
              schedule.status = 'published';
              schedule.results = results;
              schedule.publishedAt = new Date();

              await redis.setex(key, 86400, JSON.stringify(schedule)); // Keep for 24 hours
              await redis.lrem('social_queue', 1, key); // Remove from queue

              logger.info(`Published scheduled post ${schedule.postId} to social media`);
            } catch (error) {
              logger.error('Scheduled post publish error:', error);
              schedule.status = 'failed';
              schedule.error = error.message;
              await redis.setex(key, 86400, JSON.stringify(schedule));
            }
          }
        }
      } catch (error) {
        logger.error('Social scheduler error:', error);
      }
    });

    logger.info('Social media scheduler started');
  }

  async getScheduledPosts(userId) {
    try {
      const redis = getRedisClient();
      const queueKeys = await redis.lrange('social_queue', 0, -1);
      const scheduledPosts = [];

      for (const key of queueKeys) {
        const scheduleData = await redis.get(key);
        if (scheduleData) {
          const schedule = JSON.parse(scheduleData);
          // In a real app, you'd filter by userId
          scheduledPosts.push(schedule);
        }
      }

      return scheduledPosts.sort((a, b) => 
        new Date(a.scheduleTime) - new Date(b.scheduleTime)
      );
    } catch (error) {
      logger.error('Get scheduled posts error:', error);
      throw error;
    }
  }

  async cancelScheduledPost(scheduleKey) {
    try {
      const redis = getRedisClient();
      await redis.del(scheduleKey);
      await redis.lrem('social_queue', 1, scheduleKey);
      return { success: true };
    } catch (error) {
      logger.error('Cancel scheduled post error:', error);
      throw error;
    }
  }

  async getSocialAnalytics(postId) {
    try {
      const redis = getRedisClient();
      const analyticsKey = `social_analytics:${postId}`;
      const analytics = await redis.get(analyticsKey);
      
      if (analytics) {
        return JSON.parse(analytics);
      }

      // If no cached analytics, return default structure
      return {
        platforms: {
          twitter: { likes: 0, retweets: 0, replies: 0 },
          linkedin: { likes: 0, comments: 0, shares: 0 },
          facebook: { likes: 0, comments: 0, shares: 0 },
          instagram: { likes: 0, comments: 0 }
        },
        totalEngagement: 0,
        lastUpdated: new Date()
      };
    } catch (error) {
      logger.error('Social analytics error:', error);
      throw error;
    }
  }
}

export default new SocialMediaService();
