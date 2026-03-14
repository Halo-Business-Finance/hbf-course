import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Suppress all console output in production to prevent information leakage
if (import.meta.env.PROD) {
  const noop = () => {};
  console.log = noop;
  console.debug = noop;
  console.info = noop;
  console.warn = noop;
  // Keep console.error for critical runtime errors only, but sanitize output
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    // Only output generic error indicator, no details
    originalError('[Application Error]');
  };
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
