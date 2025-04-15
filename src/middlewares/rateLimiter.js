const redis = require('../config/redis');

const rateLimiter = (limit = 100, windowInSeconds = 900) => {
  return async (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey) return res.status(400).json({ error: 'Missing API key for rate limiting' });

    const redisKey = `ratelimit:${apiKey}`;
    try {
      const current = await redis.incr(redisKey);

      if (current === 1) {
        await redis.expire(redisKey, windowInSeconds); // Set TTL
      }

      if (current > limit) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }

      res.setHeader('X-RateLimit-Limit', limit);
      res.setHeader('X-RateLimit-Remaining', Math.max(limit - current, 0));

      next();
    } catch (err) {
      console.error('Rate limit middleware error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = rateLimiter;
