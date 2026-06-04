import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// ════════════════════════════════════════════════════════════════════════════
// B5: Sentry — optional production error monitoring.
// Activates only when VITE_SENTRY_DSN env var is set in Vercel.
// The ErrorBoundary in App.jsx checks window.Sentry and forwards crashes.
// Also captures unhandled promise rejections + uncaught errors.
// ════════════════════════════════════════════════════════════════════════════
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN
if (SENTRY_DSN) {
  // Dynamically import the lightweight Sentry browser bundle so it doesn't
  // bloat the main bundle when not in use.
  import('https://browser.sentry-cdn.com/7.114.0/bundle.tracing.min.js')
    .then(() => {
      // window.Sentry is now available
      if (window.Sentry && window.Sentry.init) {
        window.Sentry.init({
          dsn: SENTRY_DSN,
          environment: import.meta.env.MODE || 'production',
          // Capture unhandled exceptions and rejections automatically
          integrations: [],
          // Sample 100% of errors (low volume expected)
          sampleRate: 1.0,
          // No performance traces to keep things lightweight
          tracesSampleRate: 0,
          // Don't capture noisy errors
          ignoreErrors: [
            'ResizeObserver loop limit exceeded',
            'Non-Error promise rejection captured',
          ],
        })
        console.log('Sentry initialized')
      }
    })
    .catch((e) => {
      console.warn('Sentry failed to load — errors will still be caught locally:', e)
    })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
