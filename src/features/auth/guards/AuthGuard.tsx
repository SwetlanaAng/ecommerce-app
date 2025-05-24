import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppRouterPaths } from '../../../routes/AppRouterPathsEnums';
import Loader from '../../../components/loader/Loader';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={AppRouterPaths.MAIN} />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={AppRouterPaths.MAIN} />;
  }

  return <>{children}</>;
};

export default AuthGuard;
