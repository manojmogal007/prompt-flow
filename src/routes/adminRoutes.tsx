import { UserManagement } from '../features/admin/pages/UserManagement';
import { UserDetails } from '../features/admin/pages/UserDetails';
import { AdminRouteGuard } from '../utils/routeGuard/AdminRouteGuard';

export const adminRoutes = {
  path: 'admin',
  element: <AdminRouteGuard />,
  children: [
    {
      path: 'users',
      element: <UserManagement />,
    },
    {
      path: 'user/:encodedParams',
      element: <UserDetails />,
    },
  ],
};
