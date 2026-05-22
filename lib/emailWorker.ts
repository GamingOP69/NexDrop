import { getRedis } from './redis';
import { EmailQueueJob, sendEmail } from './email';
import { env } from './env';

async function workerLoop() {
  const redis = getRedis();
  if (!redis) {
    console.error('Redis not configured, email worker cannot run');
    process.exit(1);
  }

  console.log('Email worker started');
  while (true) {
    try {
      // BRPOP with 5s timeout
      const res = await redis.blpop('email:queue', 5);
      if (!res) continue;
      const payload = JSON.parse(res[1]) as EmailQueueJob;
      try {
        await sendEmail(payload.job);
      } catch (e) {
        console.error('Email send failed, requeueing', e);
        payload.attempts = (payload.attempts || 0) + 1;
        if (payload.attempts <= env.EMAIL_QUEUE_RETRIES) {
          await redis.rpush('email:queue', JSON.stringify(payload));
        } else {
          console.error('Dropping email after retries', payload.job.to, payload.job.subject);
        }
      }
    } catch (err) {
      console.error('Worker error', err);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

if (require.main === module) {
  workerLoop();
}
