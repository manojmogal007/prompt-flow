import { type FC } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface Props {
  triggerClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  label: string;
  icon?: any;
  size?: 'sm' | 'md' | 'lg';
  extraClasses?: string;
  isHollow?: boolean;
  color?: string;
}

const colors: Record<string, { solid: string; hollow: string }> = {
  blue: {
    solid: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20',
    hollow: 'text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30'
  },
  red: {
    solid: 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20',
    hollow: 'text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/30'
  },
  green: {
    solid: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20',
    hollow: 'text-emerald-600 border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-900/30'
  },
  gray: {
    solid: 'bg-gray-800 hover:bg-gray-900 text-white shadow-gray-500/20 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100',
    hollow: 'text-gray-600 border-gray-200 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800'
  },
  indigo: {
    solid: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20',
    hollow: 'text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-800 dark:hover:bg-indigo-900/30'
  },
  purple: {
    solid: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20',
    hollow: 'text-purple-600 border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/30'
  }
};

const Button: FC<Props> = ({
  triggerClick,
  label,
  disabled,
  loading,
  icon: Icon,
  size = 'md',
  extraClasses = '',
  isHollow,
  color = 'blue'
}) => {

  const themeByColor = colors[color] || colors.blue;
  const variantClass = isHollow ? `border ${themeByColor.hollow}` : `${themeByColor.solid} shadow-lg shadow-sm border border-transparent`;

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-7 text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      onClick={triggerClick}
      className={`
        relative flex items-center justify-center font-semibold rounded-xl transition-all duration-200
        ${variantClass} 
        ${sizeClasses[size]} 
        ${extraClasses}
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
      `}
    >
      {loading ? (
        <Loader2 className={`animate-spin mr-2 ${iconSizes[size]}`} />
      ) : Icon ? (
        <Icon className={`mr-2 ${iconSizes[size]}`} />
      ) : null}

      {label}
    </motion.button>
  );
};

export default Button;
