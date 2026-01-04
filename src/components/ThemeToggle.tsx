import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'md', showLabel = false, className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        relative overflow-hidden rounded-lg
        bg-gray-100 dark:bg-dark-800
        border border-gray-200 dark:border-dark-700
        hover:bg-gray-200 dark:hover:bg-dark-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-dark-900
        transition-all duration-200 ease-in-out
        flex items-center justify-center
        group
        ${className}
      `}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Sun Icon */}
      <Sun
        className={`
          ${iconSizes[size]}
          text-yellow-500
          transition-all duration-300 ease-in-out
          ${theme === 'light' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}
        `}
      />

      {/* Moon Icon */}
      <Moon
        className={`
          ${iconSizes[size]}
          text-blue-400
          absolute inset-0 m-auto
          transition-all duration-300 ease-in-out
          ${theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}
        `}
      />

      {/* Tooltip */}
      <div className='absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
        <div className='bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded whitespace-nowrap'>
          {theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        </div>
      </div>

      {showLabel && (
        <span className='ml-2 text-sm font-medium text-gray-700 dark:text-gray-300'>{theme === 'light' ? 'Light' : 'Dark'}</span>
      )}
    </button>
  );
};
