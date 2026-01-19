import { LogOut, Sun, Moon, Shield, BarChart2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../auth/useAuth';
import { useLocation, useNavigate } from 'react-router';
import iconImage from '../../../assets/app_icon.png';
import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';
import { useMemo, useState } from 'react';
import { UsageAnalyticsModal } from './UsageAnalyticsModal';

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { isSuperAdmin, isAdmin, plan, isUnlimited } = useSettings();
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const location = useLocation();
  const enableAdminFeatures = isSuperAdmin || isAdmin;
  const isAdminPath = useMemo(() => {
    return location?.pathname.startsWith('/prompt-flow/admin');
  }, [location]);

  const triggerLogout = async () => {
    const res = await logout();
    if (res?.data?.status) {
      localStorage.removeItem('accessToken');
      navigate('/prompt-flow/auth/signin');
    }
  };

  return (
    <div className='left-0 right-0 z-50 flex justify-center py-2 sticky top-0'>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className='
          w-full
          h-16 
          border border-white/20 dark:border-gray-700/50 
          bg-white/70 dark:bg-gray-900/60 
          backdrop-blur-xl 
          shadow-lg shadow-gray-200/20 dark:shadow-black/40
          flex items-center justify-between 
          px-6
        '
      >
        <div className='flex items-center gap-3'>
          <div className='relative group'>
            <div className='absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200'></div>
            <img
              src={iconImage}
              alt='App Icon'
              className='relative w-9 h-9 object-contain transform group-hover:scale-110 transition-transform duration-300'
            />
          </div>
          <h2 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight'>
            PromptFlow <span className='text-blue-600 dark:text-blue-400'>Live</span>
          </h2>
        </div>

        <div className='flex items-center gap-5'>
          {enableAdminFeatures && (
            <button
              onClick={() => navigate(isAdminPath ? '/prompt-flow/workflows' : '/prompt-flow/admin/users')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isAdminPath
                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50'
                : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                } `}
            >
              <Shield className='w-4 h-4' />
              {isAdminPath ? 'User' : 'Admin'}
            </button>
          )}
          {user?.firstName && (
            <div className='hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700'>
              <div className='text-right'>
                <p className='text-sm font-semibold text-gray-800 dark:text-gray-100 leading-none'>
                  {user.firstName} {user.lastName}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                  {isUnlimited ? 'Unlimited' : plan?.slice(0, 1)?.toUpperCase() + plan?.slice(1)} Plan
                </p>
              </div>
              <div className='w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-[2px]'>
                <div className='w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center'>
                  <span className='text-sm font-bold bg-clip-text text-transparent bg-gradient-to-tr from-blue-500 to-indigo-600'>
                    {user.firstName?.slice(0, 1)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsAnalyticsOpen(true)}
            className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-300'
            aria-label='View Usage Analytics'
          >
            <BarChart2 className='w-5 h-5 text-gray-600 dark:text-gray-400' />
          </button>

          <button
            onClick={toggleTheme}
            className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-300'
            aria-label='Toggle Theme'
          >
            {theme === 'dark' ? <Sun className='w-5 h-5 text-amber-400' /> : <Moon className='w-5 h-5 text-indigo-600' />}
          </button>

          <button
            onClick={triggerLogout}
            className='
              flex items-center gap-2 
              bg-gray-900 dark:bg-white 
              text-white dark:text-gray-900 
              px-4 py-2 
              rounded-xl 
              text-sm font-medium 
              hover:bg-gray-800 dark:hover:bg-gray-100 
              transition-all duration-200 
              shadow-lg shadow-gray-900/20 dark:shadow-white/10
            '
          >
            <LogOut className='w-4 h-4' />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      <UsageAnalyticsModal isOpen={isAnalyticsOpen} onClose={() => setIsAnalyticsOpen(false)} />
    </div>
  );
}

export default Navbar;
