import React, { type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  position?: 'left' | 'right' | 'bottom'; // added bottom
  size?: string; // width for left/right, height for bottom
  title: string;
  titleIcon?: any;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children, position = 'right', size = 'w-80', title, titleIcon }) => {
  const Icon = titleIcon;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className='fixed inset-0 bg-black/40 z-40'
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Drawer Panel */}
          <motion.div
            className={`
              fixed bg-white dark:bg-dark-900 shadow-xl z-50
              ${position === 'bottom' ? `left-0 right-0 ${size}` : `top-0 h-full ${size}`}
              ${position === 'left' ? 'left-0' : position === 'right' ? 'right-0' : 'bottom-0'}
            `}
            initial={{
              x: position === 'right' ? '100%' : position === 'left' ? '-100%' : 0,
              y: position === 'bottom' ? '100%' : 0,
            }}
            animate={{ x: 0, y: 0 }}
            exit={{
              x: position === 'right' ? '100%' : position === 'left' ? '-100%' : 0,
              y: position === 'bottom' ? '100%' : 0,
            }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {/* Close Button */}
            <div
              className={`flex justify-between p-3 border-b border-gray-200 dark:border-dark-700 ${position === 'bottom' ? 'border-b' : 'border-b'
                }`}
            >
              <h3 className='text-xl font-semibold flex items-center justify-center text-slate-800 dark:text-dark-100'>
                {titleIcon && <Icon className='mr-2 w-5 h-5' />}
                {title}
              </h3>
              <button onClick={onClose} className='text-gray-600 hover:text-gray-900 dark:text-dark-400 dark:hover:text-dark-100'>
                ✕
              </button>
            </div>

            {/* Drawer Content */}
            <div className='p-4 overflow-y-auto h-[calc(100%-3rem)] z-50'>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
