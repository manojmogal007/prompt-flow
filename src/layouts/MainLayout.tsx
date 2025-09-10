import React, { useEffect } from 'react';
import { Outlet } from 'react-router';
import { useApiQuery } from '../utils/customHooks/apiHooks';
import { useGetAuthRequestQuery } from '../utils/services/authService';
import { useAuth } from '../auth/useAuth';
import Navbar from './components/Navbar';

export const MainLayout: React.FC = () => {
  const { handleUser } = useAuth();
  const userDetails = useApiQuery(useGetAuthRequestQuery, '/users/getUser', {});
  useEffect(() => {
    if (userDetails?.data?.user) handleUser(userDetails.data.user);
  }, [userDetails.data]);

  return (
    <div className='min-h-screen bg-white dark:bg-dark-900 relative'>
      <Navbar />
      <Outlet />
    </div>
  );
};
