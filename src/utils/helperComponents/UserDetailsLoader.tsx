import React from 'react';

const UserDetailsLoader: React.FC = () => {
    return (
        <div className='min-h-screen bg-slate-50 dark:bg-dark-900 p-6 lg:p-10 animate-pulse'>
            {/* Header Skeleton */}
            <div className='mx-auto flex justify-between items-center mb-5'>
                <div className='h-6 w-32 bg-gray-200 dark:bg-dark-700 rounded' />
                <div className='flex gap-3'>
                    <div className='h-10 w-28 bg-gray-200 dark:bg-dark-700 rounded-xl' />
                    <div className='h-10 w-32 bg-gray-200 dark:bg-dark-700 rounded-xl' />
                </div>
            </div>

            <div className='mx-auto grid grid-cols-12 gap-8'>
                {/* Left Column Skeleton */}
                <div className='col-span-12 lg:col-span-4 space-y-6'>
                    {/* Profile Card Skeleton */}
                    <div className='bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 shadow-sm relative overflow-hidden h-[400px]'>
                        <div className='absolute top-0 left-0 w-full h-24 bg-gray-200 dark:bg-dark-700' />
                        <div className='relative flex flex-col items-center text-center mt-6'>
                            <div className='w-24 h-24 rounded-3xl bg-gray-200 dark:bg-dark-700 mb-4 border-4 border-white dark:border-dark-800' />
                            <div className='h-8 w-48 bg-gray-200 dark:bg-dark-700 rounded mb-2' />
                            <div className='h-4 w-32 bg-gray-200 dark:bg-dark-700 rounded' />

                            <div className='mt-6 w-full'>
                                <div className='h-3 w-24 bg-gray-200 dark:bg-dark-700 rounded mb-2' />
                                <div className='h-12 w-full bg-gray-200 dark:bg-dark-700 rounded-xl' />
                            </div>

                            <div className='w-full mt-4 h-12 bg-gray-200 dark:bg-dark-700 rounded-xl' />
                        </div>
                    </div>

                    {/* Stats Summary Skeleton */}
                    <div className='bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 shadow-sm'>
                        <div className='h-4 w-32 bg-gray-200 dark:bg-dark-700 rounded mb-6' />
                        <div className='space-y-6'>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i}>
                                    <div className='flex justify-between mb-2'>
                                        <div className='h-3 w-20 bg-gray-200 dark:bg-dark-700 rounded' />
                                        <div className='h-3 w-16 bg-gray-200 dark:bg-dark-700 rounded' />
                                    </div>
                                    <div className='h-2 w-full bg-gray-200 dark:bg-dark-700 rounded-full' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column Skeleton */}
                <div className='col-span-12 lg:col-span-8'>
                    <div className='bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-100 dark:border-dark-700 shadow-sm h-full'>
                        <div className='flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-dark-700'>
                            <div className='h-8 w-8 bg-gray-200 dark:bg-dark-700 rounded' />
                            <div>
                                <div className='h-6 w-64 bg-gray-200 dark:bg-dark-700 rounded mb-1' />
                                <div className='h-4 w-48 bg-gray-200 dark:bg-dark-700 rounded' />
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className='col-span-full mb-4'>
                                <div className='h-3 w-32 bg-gray-200 dark:bg-dark-700 rounded mb-4' />
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className='p-4 rounded-xl border border-gray-100 dark:border-dark-700 flex items-center justify-between mb-3'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <div className='h-10 w-10 bg-gray-200 dark:bg-dark-700 rounded-lg' />
                                            <div>
                                                <div className='h-4 w-32 bg-gray-200 dark:bg-dark-700 rounded mb-1' />
                                                <div className='h-3 w-48 bg-gray-200 dark:bg-dark-700 rounded' />
                                            </div>
                                        </div>
                                        <div className='h-6 w-12 bg-gray-200 dark:bg-dark-700 rounded-full' />
                                    </div>
                                ))}
                            </div>

                            <div className='col-span-full h-px bg-gray-100 dark:bg-dark-700 my-2' />

                            <div className='col-span-full'>
                                <div className='h-3 w-40 bg-gray-200 dark:bg-dark-700 rounded mb-4' />
                            </div>

                            {[1, 2, 3, 4].map((i) => (
                                <div key={i}>
                                    <div className='h-4 w-32 bg-gray-200 dark:bg-dark-700 rounded mb-2' />
                                    <div className='h-12 w-full bg-gray-200 dark:bg-dark-700 rounded-xl' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailsLoader;
