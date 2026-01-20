import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Shield, Workflow, Zap, Crown } from 'lucide-react';
import { formatDate, calculatePercentage, getColor } from '../../../utils/helperFunctions/HelperFunctions';

interface UserCardProps {
  user: any;
  onClick: () => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const isSuperAdmin = user?.isSuperAdmin;
  const isAdmin = user?.isAdmin;
  const isBlocked = user?.isBlocked;
  const isUnlimited = user?.isUnlimited;

  // Visual Configuration based on Role
  const getRoleStyles = () => {
    if (isSuperAdmin) {
      return {
        container:
          'bg-gradient-to-br from-amber-50/80 to-red-50/50 dark:from-amber-900/10 dark:to-red-900/10 border-amber-200 dark:border-amber-500/30 shadow-amber-100 dark:shadow-none',
        iconBg: 'bg-gradient-to-br from-amber-400 to-red-500',
        badge: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50',
        blob: 'bg-amber-500',
      };
    }
    if (isAdmin) {
      return {
        container:
          'bg-gradient-to-br from-indigo-50/80 to-violet-50/50 dark:from-indigo-900/10 dark:to-violet-900/10 border-indigo-200 dark:border-indigo-500/30 shadow-indigo-100 dark:shadow-none',
        iconBg: 'bg-gradient-to-br from-indigo-400 to-violet-600',
        badge: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700/50',
        blob: 'bg-indigo-500',
      };
    }
    return {
      container: 'bg-white/80 dark:bg-dark-800/80 border-gray-200 dark:border-dark-700',
      iconBg: 'bg-gradient-to-br from-slate-400 to-gray-500',
      badge: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700',
      blob: 'bg-blue-400',
    };
  };

  const styles = getRoleStyles();

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
      onClick={onClick}
      className={`
        relative overflow-hidden cursor-pointer backdrop-blur-xl
        border rounded-2xl p-5 transition-all duration-300 group
        ${styles.container}
      `}
    >
      {/* Decorative Gradient Blob */}
      <div
        className={`
        absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-10
        ${styles.blob}
      `}
      />

      <div className='relative z-10'>
        {/* Header: User Info */}
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-center gap-3'>
            {/* Avatar */}
            <div
              className={`
              w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg
              ${isBlocked ? 'bg-red-500' : styles.iconBg}
            `}
            >
              {isSuperAdmin ? <Crown size={20} className='text-white fill-white/20' /> : user?.user?.firstName?.[0]}
            </div>

            <div>
              <h3 className='font-semibold text-gray-900 dark:text-white flex items-center gap-2'>
                {user?.user?.firstName} {user?.user?.lastName}
                {isSuperAdmin && <Crown size={14} className='text-amber-500 fill-amber-500' />}
                {isAdmin && !isSuperAdmin && <Shield size={14} className='text-indigo-500 fill-indigo-500' />}
              </h3>
              <p className='text-xs text-gray-500 dark:text-gray-400'>{user?.user?.email}</p>

              {/* Role Badge inline */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 inline-block ${
                  isSuperAdmin ? 'text-amber-600 dark:text-amber-400' : isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'
                }`}
              >
                {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
          </div>

          <div
            className={`
            px-2 py-1 rounded-full text-xs font-medium border
            ${
              isBlocked
                ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
                : 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800'
            }
          `}
          >
            {isBlocked ? 'Blocked' : 'Active'}
          </div>
        </div>

        {/* Usage Stats (Mini Bars) */}
        <div className='space-y-3 mb-4'>
          {/* Workflows */}
          <div>
            <div className='flex justify-between text-xs mb-1'>
              <span className='text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                <Workflow size={12} /> Workflows
              </span>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                <span className='border-r border-gray-200 dark:border-dark-700 pr-2 mr-2'>
                  {calculatePercentage(user?.workflowCreationUsage || 0, user?.workflowCreationLimit || 1, isUnlimited)}%
                </span>{' '}
                {user?.workflowCreationUsage || 0} / {isUnlimited ? '∞' : user?.workflowCreationLimit}
              </span>
            </div>
            <div className='h-1.5 w-full bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden'>
              <div
                className={`h-full rounded-full ${
                  getColor(
                    calculatePercentage(user?.workflowCreationUsage || 0, user?.workflowCreationLimit || 1, isUnlimited),
                    isUnlimited,
                  ).color
                }`}
                style={{
                  width: `${calculatePercentage(user?.workflowCreationUsage || 0, user?.workflowCreationLimit || 1, isUnlimited)}%`,
                }}
              />
            </div>
          </div>

          {/* Executions */}
          <div>
            <div className='flex justify-between text-xs mb-1'>
              <span className='text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                <Zap size={12} /> Executions
              </span>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                <span className='border-r border-gray-200 dark:border-dark-700 pr-2 mr-2'>
                  {calculatePercentage(user?.workflowCreationUsage || 0, user?.workflowCreationLimit || 1, isUnlimited)}%
                </span>{' '}
                {user?.executionUsage || 0} / {isUnlimited ? '∞' : user?.executionLimit}
              </span>
            </div>
            <div className='h-1.5 w-full bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden'>
              <div
                className={`h-full rounded-full ${
                  getColor(calculatePercentage(user?.executionUsage || 0, user?.executionLimit || 1, isUnlimited), isUnlimited).color
                }`}
                style={{
                  width: `${calculatePercentage(user?.executionUsage || 0, user?.executionLimit || 1, isUnlimited)}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer: Date */}
        <div className='pt-3 border-t border-gray-100 dark:border-dark-700/50 flex items-center justify-between text-xs text-gray-400'>
          <div className='flex items-center gap-1'>
            <Calendar size={12} />
            <span>Joined {user?.user?.createdAt ? formatDate(user.user.createdAt) : 'N/A'}</span>
          </div>
          <div
            className={`font-medium uppercase tracking-wider text-[10px] ${
              isUnlimited ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            {isUnlimited ? 'Unlimited' : user?.plan + ' Plan'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
