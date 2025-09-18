import  { type FC } from 'react';

const Loader: FC = () => {
  return (
    <div className='flex-col gap-4 w-full flex items-center justify-center'>
      <div className='w-11 h-11 border-3 border-transparent text-blue-400 dark:text-blue-500 text-4xl animate-spin flex items-center justify-center border-t-blue-400 dark:border-t-blue-500 rounded-full'>
        <div className='w-7 h-7 border-3 border-transparent text-red-400 dark:text-red-500 text-2xl animate-spin flex items-center justify-center border-t-red-400 dark:border-t-red-500 rounded-full'></div>
      </div>
    </div>
  );
};

export default Loader;
