const Redis = require('ioredis');
const logger = require('./logger');

let redisClient;

const connectRedis = () => {
  redisClient = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    enableReadyCheck: true,
  });

  redisClient.on('connect', () => logger.info('✅ Redis Connected'));
  redisClient.on('error', (err) => logger.error('❌ Redis Error:', err));
  redisClient.on('reconnecting', () => logger.warn('⚠️  Redis Reconnecting...'));

  return redisClient;
};

const getRedis = () => {
  if (!redisClient) throw new Error('Redis not initialized. Call connectRedis() first.');
  return redisClient;
};

module.exports = { connectRedis, getRedis };
