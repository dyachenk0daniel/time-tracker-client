import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import '@styles/reset.css';
import '@styles/globals.scss';
import GlobalErrorBoundary from '@shared/components/global-error-boundary';
import router from './router.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <GlobalErrorBoundary>
      <RouterProvider router={router} />
    </GlobalErrorBoundary>
  );
} else {
  throw new Error('Element with id "root" not found in the DOM. Check index.html.');
}
