import { createRoot } from 'react-dom/client';
import '@styles/reset.css';
import '@styles/globals.scss';
import { GlobalErrorBoundary } from '@shared/components/global-error-boundary';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(<GlobalErrorBoundary>App</GlobalErrorBoundary>);
} else {
  throw new Error('Element with id "root" not found in the DOM. Check index.html.');
}
