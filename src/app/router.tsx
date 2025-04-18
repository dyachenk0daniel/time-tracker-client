import { createBrowserRouter } from 'react-router';
import { Home } from '@pages/home';
import { Login } from '@pages/login';
import { Register } from '@pages/register';
import NotFound from '@pages/not-found';
import ProtectedRoute from '@shared/components/protected-route';
import Layout from '@shared/components/layout';
import { Routes } from '@shared/constants.ts';

const router = createBrowserRouter([
  {
    path: Routes.HOME,
    element: (
      <ProtectedRoute>
        <Layout>
          <Home />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: Routes.LOGIN,
    element: <Login />,
  },
  {
    path: Routes.REGISTER,
    element: <Register />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
