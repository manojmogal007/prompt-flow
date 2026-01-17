import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './components/Navbar';
import AccessBlocked from './components/AccessBlocked';
import { useSettings } from '../hooks/useSettings';

export const MainLayout: React.FC = () => {
  const { isBlocked } = useSettings();

  if (isBlocked) return <AccessBlocked />;
  return (
    <div className='min-h-screen bg-white dark:bg-dark-900 relative'>
      <Navbar />
      <Outlet />
    </div>
  );
};
