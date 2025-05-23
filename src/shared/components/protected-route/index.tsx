import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router';
import { useCurrentUserQuery } from '@entities/user/hooks';
import { Routes } from '@shared/constants';
import Loading from '@shared/components/loading';

function ProtectedRoute({ children }: PropsWithChildren) {
  const { data: user, isLoading } = useCurrentUserQuery();

  if (isLoading) return <Loading />;
  if (!user) return <Navigate to={Routes.LOGIN} replace />;

  return children;
}

export default ProtectedRoute;
