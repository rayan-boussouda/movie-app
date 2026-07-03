import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

export const redisConnection = redisUrl
  ? { url: redisUrl, maxRetriesPerRequest: null as null }
  : { host: process.env.REDIS_HOST ?? 'localhost', port: Number(process.env.REDIS_PORT ?? 6379), maxRetriesPerRequest: null as null };

export const redisClient = redisUrl
  ? new Redis(redisUrl)
  : new Redis({ host: process.env.REDIS_HOST ?? 'localhost', port: Number(process.env.REDIS_PORT ?? 6379) });
