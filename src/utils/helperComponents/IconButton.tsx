import { type FC } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  triggerClick: () => void;
  Icon: any;
  disabled?: boolean;
}

const IconButton: FC<Props> = ({ size = 'md', triggerClick, Icon, disabled = false }) => {
  const { theme } = useTheme();
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  return (
    <button
      disabled={disabled}
      onClick={triggerClick}
      className={`
        ${sizeClasses[size]}
        relative overflow-hidden rounded-lg
        bg-gray-100 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        hover:bg-gray-200 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        transition-all duration-200 ease-in-out
        flex items-center justify-center
        group text-gray-500 dark:text-gray-400
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Icon className={`${iconSizes[size]}`} />
    </button>
  );
};

export default IconButton;
