import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { sendPasswordResetEmail } from '../services/email.service';
import { logger } from '../config/logger';

type EmailJobData = { to: string; rawToken: string };

export const emailWorker = new Worker<EmailJobData>(
  'emails',
  async (job: Job<EmailJobData>) => {
    if (job.name === 'send-reset-email') {
      await sendPasswordResetEmail(job.data.to, job.data.rawToken);
    }
  },
  { connection: redisConnection },
);

emailWorker.on('completed', (job: Job<EmailJobData>) => {
  logger.info({ jobId: job.id }, 'Job completed');
});

emailWorker.on('failed', (job: Job<EmailJobData> | undefined, error: Error) => {
  logger.error({ jobId: job?.id, err: error }, 'Job failed');
});
