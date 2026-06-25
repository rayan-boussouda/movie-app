import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const ratingsQueue = new Queue('ratings', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
  },
});
