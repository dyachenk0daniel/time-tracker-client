import { createBrowserRouter } from 'react-router';
import { Home } from '@pages/home';
import { Login } from '@pages/login';
import { Register } from '@pages/register';
import NotFound from '@pages/not-found';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
