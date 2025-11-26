// server/src/middleware/performance.js - Performance Optimization Middleware
import compression from 'compression';
import sharp from 'sharp';
import { getRedisClient } from '../config/redis.js';
import logger from '../utils/logger.js';

// Image optimization middleware
export const imageOptimization = (req, res, next) => {
  if (req.file && req.file.mimetype.startsWith('image/')) {
    const { width = 800, height, quality = 80, format = 'webp' } = req.query;
    
    sharp(req.file.buffer)
      .resize(parseInt(width), height ? parseInt(height) : null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: parseInt(quality) })
      .toBuffer()
      .then(optimizedBuffer => {
        req.file.buffer = optimizedBuffer;
        req.file.mimetype = `image/${format}`;
        req.file.size = optimizedBuffer.length;
        next();
      })
      .catch(error => {
        logger.error('Image optimization error:', error);
        next(); // Continue with original file
      });
  } else {
    next();
  }
};

// Caching middleware
export const cacheResponse = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const redis = getRedisClient();
    
    try {
      const cached = await redis.get(key);
      if (cached) {
        const data = JSON.parse(cached);
        return res.json(data);
      }
    } catch (error) {
      logger.error('Cache retrieval error:', error);
    }
    
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to cache response
    res.json = function(data) {
      redis.setex(key, duration, JSON.stringify(data))
        .catch(error => logger.error('Cache storage error:', error));
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Compression middleware with custom settings
export const smartCompression = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
  windowBits: 15,
  memLevel: 8,
  strategy: 'default'
});

// Response time middleware
export const responseTime = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const delta = process.hrtime(start);
    const time = delta[0] * 1000 + delta[1] * 1e-6;
    
    res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
    
    // Log slow requests
    if (time > 1000) {
      logger.warn(`Slow request: ${req.method} ${req.url} - ${time.toFixed(2)}ms`);
    }
  });
  
  next();
};
