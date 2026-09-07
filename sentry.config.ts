import * as Sentry from '@sentry/react'

const sentryConfig = () => {
  const ACCEPT_DEVELOPMENT = import.meta.env.VITE_APP_SENTRY_ACCEPT_DEVELOPMENT
  const SENTRY_DSN = import.meta.env.VITE_APP_SENTRY_DSN
  const SENTRY_TARGETS = import.meta.env.VITE_APP_SENTRY_TARGETS
  const SENTRY_ENABLE = import.meta.env.VITE_APP_SENTRY_ENABLE
  const mode = import.meta.env.MODE
  const modeIgnore = ACCEPT_DEVELOPMENT?.toLowerCase?.() === 'true' ? true : mode !== 'development'

  if (modeIgnore && SENTRY_ENABLE && SENTRY_TARGETS && SENTRY_TARGETS) {
    Sentry.init({
      dsn: SENTRY_DSN,
      enabled: SENTRY_ENABLE?.toLowerCase?.() === 'true',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration(),
      ],
      // Tracing
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: SENTRY_TARGETS,
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    })
  }
}

export default sentryConfig



