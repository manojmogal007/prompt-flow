import { Fragment, useMemo, type FC } from 'react';
import { useLocation } from 'react-router';
import AuthLayout from '../AuthLayout';
import { MainLayout } from '../MainLayout';

const RootLayout: FC = () => {
  const location = useLocation();

  const isAuthLayout = useMemo(() => {
    return location.pathname.startsWith('/prompt-flow/auth/signup') || location.pathname.startsWith('/prompt-flow/auth/signin')
      ? true
      : false;
  }, [location.pathname]);

  return <Fragment>{isAuthLayout ? <AuthLayout /> : <MainLayout />}</Fragment>;
};

export default RootLayout;
