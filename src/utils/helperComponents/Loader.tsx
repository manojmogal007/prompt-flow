// import React from 'react';

// interface LoaderProps {
//   size?: 'sm' | 'md' | 'lg';
//   inline?: boolean;
//   type?: 'orbit' | 'spinner' | 'dots' | 'pulse' | 'infinity';
// }

// const Loader: React.FC<LoaderProps> = ({ size = 'md', inline = false, type = 'orbit' }) => {
//   const sizeClasses = {
//     sm: 'w-8 h-8',
//     md: 'w-12 h-12',
//     lg: 'w-20 h-20',
//   };

//   const squareSizeClasses = {
//     sm: 'w-2 h-2',
//     md: 'w-3 h-3',
//     lg: 'w-4 h-4',
//   };

//   const containerClasses = inline ? `flex items-center justify-center ${sizeClasses[size]}` : `flex items-center justify-center h-screen`;

//   const renderLoader = () => {
//     switch (type) {
//       case 'spinner':
//         return (
//           <div className='relative'>
//             {/* Outer ring */}
//             <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}></div>
//             {/* Inner ring */}
//             <div
//               className={`absolute top-1 left-1 ${
//                 size === 'sm' ? 'w-6 h-6' : size === 'md' ? 'w-10 h-10' : 'w-16 h-16'
//               } border-2 border-gray-200 border-r-pink-500 rounded-full animate-spin-slow`}
//             ></div>
//           </div>
//         );

//       case 'dots':
//         return (
//           <div className='flex space-x-1'>
//             <div className={`${squareSizeClasses[size]} bg-blue-500 rounded-full animate-bounce-slow`}></div>
//             <div className={`${squareSizeClasses[size]} bg-pink-500 rounded-full animate-bounce-slow [animation-delay:0.2s]`}></div>
//             <div className={`${squareSizeClasses[size]} bg-green-500 rounded-full animate-bounce-slow [animation-delay:0.4s]`}></div>
//             <div className={`${squareSizeClasses[size]} bg-yellow-500 rounded-full animate-bounce-slow [animation-delay:0.6s]`}></div>
//           </div>
//         );

//       case 'pulse':
//         return (
//           <div className='relative'>
//             {/* Main pulse */}
//             <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse-slow`}></div>
//             {/* Outer pulse ring */}
//             <div className={`absolute inset-0 ${sizeClasses[size]} bg-blue-200 rounded-full animate-ping`}></div>
//           </div>
//         );

//       case 'infinity':
//         return (
//           <div className={`${sizeClasses[size]} relative`}>
//             <svg
//               className={`w-full h-full ${size === 'sm' ? 'w-8 h-8' : size === 'md' ? 'w-12 h-12' : 'w-20 h-20'}`}
//               viewBox='0 0 100 50'
//               fill='none'
//               xmlns='http://www.w3.org/2000/svg'
//             >
//               {/* Background infinity path */}
//               <path
//                 d='M20 25 C20 10, 35 10, 50 25 C65 40, 80 40, 80 25 C80 10, 65 10, 50 25 C35 40, 20 40, 20 25 Z'
//                 stroke='currentColor'
//                 strokeWidth='4'
//                 fill='none'
//                 className='text-blue-600'
//               />
//               {/* Animated tracing path */}
//               <path
//                 d='M20 25 C20 10, 35 10, 50 25 C65 40, 80 40, 80 25 C80 10, 65 10, 50 25 C35 40, 20 40, 20 25 Z'
//                 stroke='currentColor'
//                 strokeWidth='3'
//                 fill='none'
//                 className='text-white animate-infinity-trace'
//                 strokeLinecap='round'
//                 strokeLinejoin='round'
//               />
//             </svg>
//           </div>
//         );

//       case 'orbit':
//       default:
//         return (
//           <div className={`relative ${sizeClasses[size]}`}>
//             {/* Center dot */}
//             <div
//               className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${squareSizeClasses[size]} bg-blue-500 rounded-full`}
//             ></div>
//             {/* 4 orbiting squares */}
//             <div className={`absolute top-0 left-1/2 -translate-x-1/2 ${squareSizeClasses[size]} bg-blue-500 rounded-sm animate-orbit`} />
//             <div
//               className={`absolute right-0 top-1/2 -translate-y-1/2 ${squareSizeClasses[size]} bg-pink-500 rounded-sm animate-orbit [animation-delay:0.3s]`}
//             />
//             <div
//               className={`absolute bottom-0 left-1/2 -translate-x-1/2 ${squareSizeClasses[size]} bg-green-500 rounded-sm animate-orbit [animation-delay:0.6s]`}
//             />
//             <div
//               className={`absolute left-0 top-1/2 -translate-y-1/2 ${squareSizeClasses[size]} bg-yellow-500 rounded-sm animate-orbit [animation-delay:0.9s]`}
//             />
//           </div>
//         );
//     }
//   };

//   return <div className={containerClasses}>{renderLoader()}</div>;
// };

// export default Loader;

import React, { type FC } from 'react';

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
