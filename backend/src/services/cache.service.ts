import { redisClient } from '../config/redis';

export const getCache = async <T>(key: string): Promise<T | null> => {
  const cached = await redisClient.get(key);
  return cached ? (JSON.parse(cached) as T) : null;
};

export const setCache = async (
  key: string,
  value: unknown,
  ttlSeconds: number,
): Promise<void> => {
  await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
};

export const invalidateCache = async (pattern: string): Promise<void> => {
  const keys = await redisClient.keys(pattern);
  if (keys.length) await redisClient.del(...keys);
};

export const invalidateCacheScan = async (pattern: string): Promise<void> => {
  const stream = redisClient.scanStream({ match: pattern });

  stream.on('data', async (keys: string[]) => {
    if (keys.length) await redisClient.del(keys);
  });

  await new Promise((resolve) => stream.on('end', resolve));
};
