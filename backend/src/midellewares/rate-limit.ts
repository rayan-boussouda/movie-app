import { redisClient } from '../config/redis';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

export const rateLimit = (maxRequests: number, windowSeconds: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ip = req.ip;
      const key = `rate-limit:${req.path}:${ip}`;

      const count = await redisClient.incr(key);

      if (count === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      if (count > maxRequests) {
        throw new AppError('Too many requests, please try again later', 429);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
