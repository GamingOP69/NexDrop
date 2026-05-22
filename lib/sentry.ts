import * as Sentry from '@sentry/node';
import { env } from './env';

export function initSentry() {
  if (!env.SENTRY_DSN) return;
  try {
    Sentry.init({ dsn: env.SENTRY_DSN, environment: env.SENTRY_ENVIRONMENT, tracesSampleRate: 0 });
    console.log('Sentry initialized');
  } catch (e) {
    console.error('Sentry init failed', e);
  }
}

export const captureException = (err: any) => {
  if (!env.SENTRY_DSN) return;
  try { Sentry.captureException(err); } catch (e) { console.error('Sentry capture failed', e); }
};
