import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/useAuth';
import { useApiQuery } from '../../utils/customHooks/apiHooks';
import { useGetAuthRequestQuery } from '../../utils/services/authService';
import iconImage from '../../../assets/app_icon.png';
import { useSettings } from '../../hooks/useSettings';

function BootstrapGate({ children }: any) {
  const {
    handleUser,
    user: { id },
  } = useAuth();
  const { handleSettings } = useSettings();
  const { data, isLoading } = useApiQuery(useGetAuthRequestQuery, '/users/getUser', {});
  useEffect(() => {
    // if (data?.user) handleUser({ ...data.user, ...data.settings, id: data.user._id, settingsId: data.settings._id });
    if (data?.user) handleUser({ ...data.user, id: data.user._id });
    if (data?.settings) handleSettings({ ...data.settings, id: data.settings._id });
  }, [data]);

  if (isLoading || !id)
    return (
      <div className='h-screen w-screen bg-slate-50 dark:bg-dark-900 flex flex-col items-center justify-center overflow-hidden relative'>
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[120px]' />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='relative z-10 flex flex-col items-center'
        >
          <div className='flex items-center gap-3 mb-6'>
            <div className='relative group'>
              <div className='absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200'></div>
              <img
                src={iconImage}
                alt='App Icon'
                className='relative w-9 h-9 object-contain transform group-hover:scale-110 transition-transform duration-300'
              />
            </div>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight'>
              PromptFlow <span className='text-blue-600 dark:text-blue-400'>Live</span>
            </h1>
          </div>

          <div className='w-48 h-1 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden'>
            <motion.div
              className='h-full bg-gradient-to-r from-blue-600 to-indigo-600'
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: 'easeInOut',
              }}
            />
          </div>
          <p className='mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse'>Initializing workspace...</p>
        </motion.div>
      </div>
    );

  return children;
}

export default BootstrapGate;
