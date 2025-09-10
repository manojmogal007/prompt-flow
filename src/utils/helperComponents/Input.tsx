import React, { type FC } from 'react';

interface Props {
  value: any;
  handleInputChange: (val: any, key: string) => void;
  placeHolder?: string;
  type?: string;
  valKey?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Input: FC<Props> = ({ value, handleInputChange, placeHolder = '', type = 'text', valKey = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'py-1',
    md: 'py-2',
    lg: 'py-3',
  };
  return (
    <input
      value={value || ''}
      onChange={(e) => handleInputChange(e.target.value, valKey)}
      type={type}
      className={`block w-full pr-3 ${sizeClasses[size]} pl-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-white`}
      placeholder={placeHolder}
    />
  );
};
