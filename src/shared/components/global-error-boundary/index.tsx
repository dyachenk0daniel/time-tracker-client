import { PropsWithChildren } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import s from './styles.module.scss';

const ErrorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={s.errorIcon}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className={s.errorOverlay}>
      <div className={s.errorContainer}>
        <div className={s.errorIconWrapper}>
          <ErrorIcon />
        </div>
        <h2 className={s.errorTitle}>Oops! Something Went Wrong</h2>
        <p className={s.errorDescription}>
          We encountered an unexpected error. Don't worry, we can help you get back on track.
        </p>
        <pre className={s.errorMessage}>{error.message}</pre>
        <div className={s.buttonWrapper}>
          <button onClick={resetErrorBoundary} className={s.reloadButton}>
            Reload Application
          </button>
        </div>
      </div>
    </div>
  );
}

function GlobalErrorBoundary({ children }: PropsWithChildren) {
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
      {children}
    </ErrorBoundary>
  );
}

export default GlobalErrorBoundary;
