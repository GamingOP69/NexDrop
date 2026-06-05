import { afterEach, describe, expect, it, vi } from 'vitest';

const baseEnv = {
  NODE_ENV: 'test',
  APP_URL: 'http://localhost:3000',
  JWT_ACCESS_SECRET: 'a'.repeat(32),
  JWT_REFRESH_SECRET: 'b'.repeat(32),
  EMAIL_QUEUE_ENABLED: 'true',
  EMAIL_QUEUE_RETRIES: '3',
  EMAIL_DIRECT_CONCURRENCY_LIMIT: '4',
  EMAIL_QUEUE_FAILOVER_COOLDOWN_MS: '30000',
  SMTP_HOST: 'smtp.example.com',
  SMTP_USER: 'mailer',
  SMTP_PASS: 'secret-password',
  REDIS_URL: 'redis://localhost:6379',
  RABBITMQ_URL: '',
  RABBITMQ_HOST: 'rabbit.example.com',
  RABBITMQ_PORT: '10135',
  RABBITMQ_USERNAME: '',
  RABBITMQ_PASSWORD: '',
  RABBITMQ_VHOST: '/'
};

const { rpushMock, publishMock } = vi.hoisted(() => ({
  rpushMock: vi.fn(),
  publishMock: vi.fn(async () => {
    return true;
  })
}));

const { createTransportMock, sendMailMock } = vi.hoisted(() => {
  const sendMailMock = vi.fn(async () => undefined);
  return {
    sendMailMock,
    createTransportMock: vi.fn(() => ({ sendMail: sendMailMock }))
  };
});

vi.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: createTransportMock
  }
}));

vi.mock('../lib/redis', () => ({
  getRedis: vi.fn(() => ({
    rpush: rpushMock
  }))
}));

vi.mock('../lib/rabbitmq', () => ({
  EMAIL_QUEUE_NAME: 'email:queue',
  isRabbitMqConfigured: vi.fn(() => true),
  publishRabbitMqMessage: publishMock
}));

vi.mock('fs/promises', () => ({
  __esModule: true,
  default: {
    readFile: vi.fn(async () => 'Hello {{name}}')
  },
  readFile: vi.fn(async () => 'Hello {{name}}')
}));

afterEach(() => {
  process.env = {
    ...process.env,
    ...baseEnv
  };
  rpushMock.mockReset();
  publishMock.mockReset();
  sendMailMock.mockReset();
  createTransportMock.mockClear();
});

describe('email queue fallback', () => {
  it('sends directly when SMTP is available and the queue is enabled', async () => {
    process.env = {
      ...process.env,
      ...baseEnv
    };

    vi.resetModules();
    const { queueEmail } = await import('../lib/email');

    await queueEmail('test-template', 'user@example.com', 'Subject', { name: 'NexDrop' });

    expect(createTransportMock).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(publishMock).not.toHaveBeenCalled();
    expect(rpushMock).not.toHaveBeenCalled();
  });

  it('queues when direct delivery fails', async () => {
    process.env = {
      ...process.env,
      ...baseEnv
    };

    sendMailMock.mockRejectedValueOnce(new Error('smtp unavailable'));

    vi.resetModules();
    const { queueEmail } = await import('../lib/email');

    await queueEmail('test-template', 'user@example.com', 'Subject', { name: 'NexDrop' });

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(publishMock).toHaveBeenCalledTimes(1);
    expect(rpushMock).not.toHaveBeenCalled();
  });
});