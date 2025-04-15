const redis = require('../config/redis');

const cacheResponse = async (key, data, expiration = 600) => {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', expiration); // cache for 10 minutes (600 seconds)
  } catch (err) {
    console.error('Error caching data', err);
  }
};

const getCache = async (key) => {
  try {
    const cachedData = await redis.get(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (err) {
    console.error('Error fetching cache', err);
    return null;
  }
};

module.exports = { cacheResponse, getCache };
