import { env } from './env';

let sentryModulePromise: Promise<typeof import('@sentry/node')> | null = null;

async function getSentry() {
  sentryModulePromise ??= import('@sentry/node');
  return sentryModulePromise;
}

export function initSentry() {
  if (!env.SENTRY_DSN) return;
  void getSentry()
    .then((Sentry) => {
      Sentry.init({ dsn: env.SENTRY_DSN, environment: env.SENTRY_ENVIRONMENT, tracesSampleRate: 0 });
      console.log('Sentry initialized');
    })
    .catch((error) => {
      console.error('Sentry init failed', error);
    });
}

export const captureException = (err: any) => {
  if (!env.SENTRY_DSN) return;
  void getSentry()
    .then((Sentry) => {
      Sentry.captureException(err);
    })
    .catch((error) => {
      console.error('Sentry capture failed', error);
    });
};
