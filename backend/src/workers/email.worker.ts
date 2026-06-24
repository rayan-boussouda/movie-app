import { Worker, Job } from 'bullmq';
import { redisConnection } from '../config/redis';
import { sendPasswordResetEmail } from '../services/email.service';

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
  console.log(`Job ${job.id} completed`);
});

emailWorker.on('failed', (job: Job<EmailJobData> | undefined, error: Error) => {
  console.error(`Job ${job?.id} failed:`, error.message);
});
