import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import prisma from '../config/prisma';

export const ratingWorker = new Worker(
  'ratings',
  async (job: Job) => {
    if (job.name === 'agregate-rating') {
      const result = await prisma.rating.aggregate({
        where: { movieId: job.data.movieId },
        _avg: { value: true },
        _count: true,
      });

      await prisma.movie.update({
        where: { id: job.data.movieId },
        data: {
          averageRating: result._avg.value ?? 0,
          ratingCount: result._count,
        },
      });
    }
  },
  { connection: redisConnection },
);

ratingWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

ratingWorker.on('failed', (job: Job | undefined, error: Error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});
