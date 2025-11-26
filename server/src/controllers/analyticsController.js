import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import Analytics from '../models/Analytics.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { getRedisClient } from '../config/redis.js';

export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const { range = '7d', postId, userId } = req.query;
  const currentUser = req.user.id;

  try {

    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

  
    const matchQuery = {
      timestamp: { $gte: startDate, $lte: endDate }
    };

    if (postId) {
      matchQuery.postId = postId;
    } else {
      const userPosts = await Post.find({ author: currentUser }).select('_id');
      matchQuery.postId = { $in: userPosts.map(p => p._id) };
    }

    const [
      overviewStats,
      timeSeriesData,
      topPerformingPosts,
      trafficSources,
      audienceData,
      engagementMetrics,
      deviceStats,
      geoData
    ] = await Promise.all([
      Analytics.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalViews: { $sum: '$pageViews' },
            uniqueViews: { $sum: '$uniqueViews' },
            totalLikes: { $sum: '$likes' },
            totalComments: { $sum: '$comments' },
            totalShares: { $sum: '$shares' },
            averageTimeOnPage: { $avg: '$timeOnPage' },
            bounceRate: { $avg: '$bounceRate' },
            conversionRate: { $avg: '$conversionRate' }
          }
        }
      ]),

      Analytics.aggregate([
        {
          $match: {
            author: new mongoose.Types.ObjectId(currentUser), 
            publishedAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' }
            },
            views: { $sum: '$pageViews' },
            uniqueViews: { $sum: '$uniqueViews' },
            engagement: {
              $sum: {
                $add: ['$likes', '$comments', '$shares']
              }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),

      Post.aggregate([
        {
          $match: {
            author: mongoose.Types.ObjectId(currentUser),
            publishedAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $lookup: {
            from: 'analytics',
            localField: '_id',
            foreignField: 'postId',
            as: 'analytics'
          }
        },
        {
          $addFields: {
            totalViews: { $sum: '$analytics.pageViews' },
            totalEngagement: {
              $sum: {
                $add: [
                  { $sum: '$analytics.likes' },
                  { $sum: '$analytics.comments' },
                  { $sum: '$analytics.shares' }
                ]
              }
            }
          }
        },
        { $sort: { totalViews: -1 } },
        { $limit: 10 },
        {
          $project: {
            title: 1,
            slug: 1,
            publishedAt: 1,
            totalViews: 1,
            totalEngagement: 1,
            category: 1
          }
        }
      ]),

      Analytics.aggregate([
        { $match: matchQuery },
        { $unwind: '$trafficSources' },
        {
          $group: {
            _id: '$trafficSources.source',
            visits: { $sum: '$trafficSources.visits' },
            percentage: { $avg: '$trafficSources.percentage' }
          }
        },
        { $sort: { visits: -1 } }
      ]),

      Analytics.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            ageGroups: { $push: '$demographics.age' },
            locations: { $push: '$demographics.location' },
            interests: { $push: '$demographics.interests' }
          }
        }
      ]),

      Analytics.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              week: { $week: '$timestamp' }
            },
            avgEngagementRate: { $avg: '$engagementRate' },
            totalEngagements: {
              $sum: { $add: ['$likes', '$comments', '$shares'] }
            }
          }
        }
      ]),

      Analytics.aggregate([
        { $match: matchQuery },
        { $unwind: '$deviceInfo' },
        {
          $group: {
            _id: {
              device: '$deviceInfo.device',
              browser: '$deviceInfo.browser'
            },
            count: { $sum: 1 }
          }
        }
      ]),

      Analytics.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$demographics.location.country',
            visits: { $sum: 1 },
            views: { $sum: '$pageViews' }
          }
        },
        { $sort: { visits: -1 } },
        { $limit: 20 }
      ])
    ]);

    const previousPeriodStart = new Date(startDate);
    const periodLength = endDate - startDate;
    previousPeriodStart.setTime(startDate.getTime() - periodLength);

    const previousPeriodStats = await Analytics.aggregate([
      {
        $match: {
          ...matchQuery,
          timestamp: { $gte: previousPeriodStart, $lt: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$pageViews' },
          totalLikes: { $sum: '$likes' },
          totalComments: { $sum: '$comments' },
          totalShares: { $sum: '$shares' }
        }
      }
    ]);


    const currentStats = overviewStats[0] || {};
    const previousStats = previousPeriodStats[0] || {};

    const growthRates = {
      views: calculateGrowthRate(currentStats.totalViews, previousStats.totalViews),
      likes: calculateGrowthRate(currentStats.totalLikes, previousStats.totalLikes),
      comments: calculateGrowthRate(currentStats.totalComments, previousStats.totalComments),
      shares: calculateGrowthRate(currentStats.totalShares, previousStats.totalShares)
    };


    const redis = getRedisClient();
    const realTimeMetrics = await redis.get(`realtime_metrics:${currentUser}`);

    const response = {
      overview: {
        ...currentStats,
        growthRates
      },
      timeSeries: timeSeriesData.map(item => ({
        date: new Date(item._id.year, item._id.month - 1, item._id.day),
        views: item.views,
        uniqueViews: item.uniqueViews,
        engagement: item.engagement
      })),
      topPosts: topPerformingPosts,
      trafficSources: trafficSources,
      audience: {
        demographics: audienceData[0] || {},
        engagement: engagementMetrics
      },
      technical: {
        devices: deviceStats,
        geographic: geoData
      },
      realTime: realTimeMetrics ? JSON.parse(realTimeMetrics) : null
    };

  
    await redis.setex(`analytics:${currentUser}:${range}`, 300, JSON.stringify(response));

    res.json(response);

  } catch (error) {
    logger.error('Dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

export const trackPageView = asyncHandler(async (req, res) => {
  const {
    postId,
    sessionId,
    userId,
    referrer,
    userAgent,
    ipAddress,
    location,
    deviceInfo
  } = req.body;

  try {

    const redis = getRedisClient();
    const viewKey = `view:${postId}:${sessionId}`;
    const isUniqueView = !(await redis.exists(viewKey));


    const analyticsData = {
      postId,
      userId: userId || null,
      sessionId,
      pageViews: 1,
      uniqueViews: isUniqueView ? 1 : 0,
      timestamp: new Date(),
      referrer,
      userAgent,
      ipAddress,
      demographics: {
        location: location || {},
        device: deviceInfo || {}
      },
      trafficSources: [{
        source: getReferrerSource(referrer),
        visits: 1
      }]
    };

    await Analytics.create(analyticsData);

    const updateData = {
      $inc: {
        'analytics.views': 1,
        'analytics.uniqueViews': isUniqueView ? 1 : 0
      }
    };

    await Post.findByIdAndUpdate(postId, updateData);


    if (isUniqueView) {
      await redis.setex(viewKey, 86400, '1'); 
    }

  
    await updateRealTimeMetrics(postId, userId);

    res.json({ success: true, tracked: true, unique: isUniqueView });

  } catch (error) {
    logger.error('Track page view error:', error);
    res.status(500).json({ error: 'Failed to track page view' });
  }
});


export const getPostAnalytics = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { range = '30d' } = req.query;

  try {
  
    const post = await Post.findById(postId);
    if (!post || post.author.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Post not found' });
    }

  
    const analytics = await getDetailedPostAnalytics(postId, range);

    res.json(analytics);

  } catch (error) {
    logger.error('Post analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch post analytics' });
  }
});


const calculateGrowthRate = (current, previous) => {
  if (!previous || previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const getReferrerSource = (referrer) => {
  if (!referrer) return 'direct';
  
  const url = new URL(referrer);
  const domain = url.hostname;
  
  if (domain.includes('google')) return 'google';
  if (domain.includes('facebook')) return 'facebook';
  if (domain.includes('twitter')) return 'twitter';
  if (domain.includes('linkedin')) return 'linkedin';
  if (domain.includes('reddit')) return 'reddit';
  
  return 'other';
};

const updateRealTimeMetrics = async (postId, userId) => {
  const redis = getRedisClient();
  const now = Date.now();
  

  await redis.zadd('active_users', now, userId || 'anonymous');
  await redis.zremrangebyscore('active_users', '-inf', now - 300000); 
  
 
  const hourKey = `views:hour:${Math.floor(now / 3600000)}`;
  await redis.incr(hourKey);
  await redis.expire(hourKey, 3600);
  
 
  const postKey = `post_metrics:${postId}`;
  await redis.hincrby(postKey, 'views', 1);
  await redis.expire(postKey, 86400); // 24 hours
};

const getDetailedPostAnalytics = async (postId, range) => {
  
  return {
   
  };
};

export {
  getDashboardAnalytics,
  trackPageView,
  getPostAnalytics
};
