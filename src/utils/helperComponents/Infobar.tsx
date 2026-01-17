import { type FC } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface InfobarProps {
  title: string;
  type: 'success' | 'error' | 'warning' | 'info';
  description?: string;
  extraClasses?: string;
}

export const Infobar: FC<InfobarProps> = ({ title, type, description = '', extraClasses = '' }) => {
  const typeConfig = {
    success: {
      icon: CheckCircle2,
      bg: 'bg-emerald-50 dark:bg-emerald-900/10',
      border: 'border-emerald-200 dark:border-emerald-800/30',
      text: 'text-emerald-900 dark:text-emerald-100',
      description: 'text-emerald-700 dark:text-emerald-200/70',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-50 dark:bg-red-900/10',
      border: 'border-red-200 dark:border-red-800/30',
      text: 'text-red-900 dark:text-red-100',
      description: 'text-red-700 dark:text-red-200/70',
      iconColor: 'text-red-500 dark:text-red-400',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-50 dark:bg-amber-900/10',
      border: 'border-amber-200 dark:border-amber-800/30',
      text: 'text-amber-900 dark:text-amber-100',
      description: 'text-amber-700 dark:text-amber-200/70',
      iconColor: 'text-amber-500 dark:text-amber-400',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50 dark:bg-blue-900/10',
      border: 'border-blue-200 dark:border-blue-800/30',
      text: 'text-blue-900 dark:text-blue-100',
      description: 'text-blue-700 dark:text-blue-200/70',
      iconColor: 'text-blue-500 dark:text-blue-400',
    },
  };

  const config = typeConfig[type || 'info'];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className={`relative w-full rounded-xl border p-4 ${config.bg} ${config.border} ${extraClasses}`}
    >
      <div className='flex items-start gap-3'>
        <div className={`flex-shrink-0 mt-0.5 ${config.iconColor}`}>
          <Icon className='w-5 h-5' aria-hidden='true' />
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className={`text-sm font-semibold ${config.text} leading-tight mb-1`}>{title}</h3>
          {description && <p className={`text-xs ${config.description} leading-relaxed`}>{description}</p>}
        </div>
      </div>
    </motion.div>
  );
};
