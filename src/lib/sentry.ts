import * as Sentry from "@sentry/react";

export function initSentry() {
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [Sentry.browserTracingIntegration()],
      tracesSampleRate: 1.0,
    });
  }
}

export function logErrorToSentry(error: any, context?: string) {
  console.error(`[Telemetry Error - ${context || "Global"}]:`, error);
  if (import.meta.env.PROD) {
    Sentry.captureException(error);
  }
}
