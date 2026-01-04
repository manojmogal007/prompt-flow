import React, { type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[9999] flex items-center justify-center'>
      {/* Background Overlay */}
      <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose}></div>

      {/* Modal Content */}
      <div className='relative z-[10000] bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-md py-4 px-5 border border-slate-200 dark:border-dark-700 transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95'>
        {children}
      </div>
    </div>
  );
};
