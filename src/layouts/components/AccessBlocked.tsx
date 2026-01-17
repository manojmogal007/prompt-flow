import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock } from 'lucide-react';
import Button from '../../utils/helperComponents/Button';
import Navbar from './Navbar';

const AccessBlocked: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className='min-h-[calc(100vh-80px)] w-full bg-slate-50 dark:bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 dark:bg-red-500/10 rounded-full blur-[120px]' />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='relative z-10 max-w-md w-full bg-white dark:bg-dark-800 rounded-3xl p-8 border border-gray-100 dark:border-dark-700 shadow-2xl text-center'
        >
          <div className='w-20 h-20 mx-auto bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 relative'>
            <div className='absolute inset-0 bg-red-400/20 rounded-full animate-ping opacity-75'></div>
            <Lock size={32} className='text-red-500 dark:text-red-400 relative z-10' />
          </div>

          <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>Access Restricted</h1>
          <p className='text-gray-500 dark:text-gray-400 mb-8 leading-relaxed'>
            Your account has been temporarily suspended or restricted due to a policy violation or administration action.
          </p>

          <div className='space-y-3'>
            <Button
              label='Contact Support'
              icon={Mail}
              triggerClick={() => (window.location.href = 'mailto:manojmogal1999@gmail.com')}
              extraClasses='w-full justify-center bg-red-500 hover:bg-red-600 border-transparent text-white shadow-lg shadow-red-500/20'
            />

            {/* <button
              onClick={() => navigate('/')}
              className='w-full py-3 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-700 transition-all flex items-center justify-center gap-2'
            >
              <ArrowLeft size={16} />
              Back to Home
            </button> */}
          </div>

          <div className='mt-8 pt-6 border-t border-gray-100 dark:border-dark-700'>
            <p className='text-xs text-gray-400'>
              Quote Reference ID:{' '}
              <span className='font-mono text-gray-600 dark:text-gray-300'>BLK-{Math.floor(Math.random() * 10000)}</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccessBlocked;
