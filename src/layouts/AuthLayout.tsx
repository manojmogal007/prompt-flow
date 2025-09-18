import { type FC } from 'react';
import { Outlet } from 'react-router';

const AuthLayout: FC = () => {
  return <Outlet />;
};

export default AuthLayout;
