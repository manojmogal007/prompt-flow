import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Workflow, Users, Crown } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

interface UsageAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UsageAnalyticsModal: React.FC<UsageAnalyticsModalProps> = ({ isOpen, onClose }) => {
  const { workflowCreationUsage, workflowCreationLimit, executionUsage, executionLimit, liveRoomUsage, liveRoomLimit, isUnlimited, plan } =
    useSettings();

  const metrics = [
    {
      label: 'Workflows',
      icon: Workflow,
      used: workflowCreationUsage || 0,
      limit: workflowCreationLimit,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Executions',
      icon: Zap,
      used: executionUsage || 0,
      limit: executionLimit,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Live Rooms',
      icon: Users,
      used: liveRoomUsage || 0,
      limit: liveRoomLimit,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ];

  const getPercentage = (used: number, limit?: number) => {
    if (isUnlimited || !limit) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]'
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className='fixed inset-0 flex items-center justify-center z-[70] p-4'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='bg-white dark:bg-dark-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-dark-700'>
              <div className='relative p-6 pb-2 border-b border-gray-100 dark:border-dark-700/50 flex items-center justify-between'>
                <div>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Plan Usage</h2>
                  <p className='text-sm text-gray-500 dark:text-gray-400'>Overview of your current consumption</p>
                </div>
                <button
                  onClick={onClose}
                  className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              <div className='px-6 py-4'>
                <div className='flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-dark-700 dark:to-dark-900 rounded-2xl text-white shadow-lg'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2.5 bg-white/10 rounded-xl backdrop-blur-sm'>
                      <Crown className={`w-6 h-6 ${isUnlimited ? 'text-amber-400' : 'text-gray-200'}`} />
                    </div>
                    <div>
                      <p className='text-xs text-gray-400 font-medium uppercase tracking-wider'>Current Plan</p>
                      <h3 className='text-lg font-bold capitalize flex items-center gap-2'>
                        {isUnlimited ? 'Unlimited' : plan}
                        {isUnlimited && <span className='text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full'>PRO</span>}
                      </h3>
                    </div>
                  </div>
                  {/* {!isUnlimited && (
                    <button className='text-xs font-semibold bg-white text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors'>
                      Upgrade
                    </button>
                  )} */}
                </div>
              </div>

              {/* Usage Metrics */}
              <div className='px-6 pb-6 space-y-6'>
                {metrics.map((metric) => (
                  <div key={metric.label}>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        <div className={`p-1.5 rounded-lg ${metric.bgColor} ${metric.textColor}`}>
                          <metric.icon className='w-4 h-4' />
                        </div>
                        <span className='font-medium text-gray-700 dark:text-gray-300 text-sm'>{metric.label}</span>
                      </div>
                      <span className='text-sm font-semibold text-gray-900 dark:text-white'>
                        {metric.used} <span className='text-gray-400 font-normal'>/ {isUnlimited ? '∞' : metric.limit}</span>
                      </span>
                    </div>
                    <div className='h-2 bg-gray-100 dark:bg-dark-900 rounded-full overflow-hidden'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${isUnlimited ? 100 : getPercentage(metric.used, metric.limit)}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${metric.color} ${isUnlimited ? 'opacity-30' : ''}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* {!isUnlimited && (
                <div className='p-4 bg-gray-50 dark:bg-dark-900/50 border-t border-gray-100 dark:border-dark-700 flex justify-center'>
                  <button className='flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group'>
                    View Pricing Plans <ChevronRight className='w-4 h-4 group-hover:translate-x-0.5 transition-transform' />
                  </button>
                </div>
              )} */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
