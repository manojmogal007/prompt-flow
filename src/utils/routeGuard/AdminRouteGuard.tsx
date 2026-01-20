import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useSettings } from '../../hooks/useSettings';

export const AdminRouteGuard: React.FC = () => {
  const { isAdmin, isSuperAdmin } = useSettings();

  if (!isAdmin && !isSuperAdmin) {
    return <Navigate to='/prompt-flow/workflows' />;
  }

  return <Outlet />;
};
