import React from 'react';

const CardLoader: React.FC = () => {
    return (
        <div className='relative overflow-hidden backdrop-blur-xl border rounded-2xl p-5 bg-white/80 dark:bg-dark-800/80 border-gray-200 dark:border-dark-700 animate-pulse'>
            <div className='flex items-start justify-between mb-4'>
                <div className='flex items-center gap-3 w-full'>
                    {/* Avatar Skeleton */}
                    <div className='w-12 h-12 rounded-xl bg-gray-200 dark:bg-dark-700 flex-shrink-0' />

                    <div className='w-full'>
                        {/* Name Skeleton */}
                        <div className='h-4 bg-gray-200 dark:bg-dark-700 rounded w-3/4 mb-2' />
                        {/* Email Skeleton */}
                        <div className='h-3 bg-gray-200 dark:bg-dark-700 rounded w-1/2' />

                        {/* Role Badge Skeleton */}
                        <div className='h-3 bg-gray-200 dark:bg-dark-700 rounded w-16 mt-2' />
                    </div>
                </div>

                {/* Status Badge Skeleton */}
                <div className='w-16 h-6 bg-gray-200 dark:bg-dark-700 rounded-full' />
            </div>

            {/* Usage Stats Skeletons */}
            <div className='space-y-3 mb-4'>
                {/* Workflow Bar */}
                <div>
                    <div className='flex justify-between mb-1'>
                        <div className='h-3 bg-gray-200 dark:bg-dark-700 rounded w-20' />
                        <div className='h-3 bg-gray-200 dark:bg-dark-700 rounded w-10' />
                    </div>
                    <div className='h-1.5 w-full bg-gray-200 dark:bg-dark-700 rounded-full' />
                </div>

                {/* Execution Bar */}
                <div>
                    <div className='flex justify-between mb-1'>
                        <div className='h-3 bg-gray-200 dark:bg-dark-700 rounded w-20' />
                        <div className='h-3 bg-gray-200 dark:bg-dark-700 rounded w-10' />
                    </div>
                    <div className='h-1.5 w-full bg-gray-200 dark:bg-dark-700 rounded-full' />
                </div>
            </div>

            {/* Footer Skeleton */}
            <div className='pt-3 border-t border-gray-100 dark:border-dark-700/50 flex items-center justify-between'>
                <div className='h-3 bg-gray-200 dark:bg-dark-700 rounded w-24' />
                <div className='h-3 bg-gray-200 dark:bg-dark-700 rounded w-16' />
            </div>
        </div>
    );
};

export default CardLoader;
