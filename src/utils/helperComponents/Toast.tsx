import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose: () => void;
  duration?: number;
  description?: string;
}

const toastConfig = {
  success: {
    icon: CheckCircle2,
    bg: 'bg-emerald-50 dark:bg-emerald-900/90',
    border: 'border-emerald-200 dark:border-emerald-800/30',
    text: 'text-emerald-900 dark:text-emerald-100',
    description: 'text-emerald-700 dark:text-emerald-200/70',
    iconColor: 'text-emerald-500 dark:text-emerald-400',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50 dark:bg-red-900/90',
    border: 'border-red-200 dark:border-red-800/30',
    text: 'text-red-900 dark:text-red-100',
    description: 'text-red-700 dark:text-red-200/70',
    iconColor: 'text-red-500 dark:text-red-400',
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 dark:bg-amber-900/90',
    border: 'border-amber-200 dark:border-amber-800/30',
    text: 'text-amber-900 dark:text-amber-100',
    description: 'text-amber-700 dark:text-amber-200/70',
    iconColor: 'text-amber-500 dark:text-amber-400',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 dark:bg-blue-900/90',
    border: 'border-blue-200 dark:border-blue-800/30',
    text: 'text-blue-900 dark:text-blue-100',
    description: 'text-blue-700 dark:text-blue-200/70',
    iconColor: 'text-blue-500 dark:text-blue-400',
  },
};

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000, description }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative w-full max-w-sm rounded-xl border p-4 shadow-xl backdrop-blur-md
        ${config.bg} ${config.border}
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h3 className={`text-sm font-semibold ${config.text} leading-tight`}>
            {message}
          </h3>
          {description && (
            <p className={`text-xs mt-1 leading-relaxed ${config.description}`}>
              {description}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1 rounded-full opacity-60 hover:opacity-100 transition-opacity ${config.text} hover:bg-black/5 dark:hover:bg-white/10`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
