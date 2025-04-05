import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@styles/reset.css';
import '@styles/globals.scss';
import GlobalErrorBoundary from '@shared/components/global-error-boundary';
import router from './router.tsx';

const rootElement = document.getElementById('root');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

if (rootElement) {
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        <RouterProvider router={router} />
      </GlobalErrorBoundary>
    </QueryClientProvider>
  );
} else {
  throw new Error('Element with id "root" not found in the DOM. Check index.html.');
}
