import React, { type ReactNode, useEffect } from 'react';

interface ModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const ModalV2: React.FC<ModalV2Props> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-[99999] flex items-center justify-center p-4'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* Background Overlay */}
      <div
        className='absolute inset-0 bg-black/50'
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      {/* Modal Content */}
      <div
        className='relative z-[100000] bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-md py-6 px-6 border border-slate-200 dark:border-dark-700'
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};



