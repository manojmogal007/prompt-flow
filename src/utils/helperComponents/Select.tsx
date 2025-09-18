import React from 'react';

interface Props {
  value: any;
  handleChange: (val: any, key: string) => void;
  valKey?: string;
  size?: 'sm' | 'md' | 'lg';
  options: any[];
}

const Select: React.FC<Props> = ({ value, handleChange, valKey = '', size = 'md', options }) => {
  const sizeClasses = {
    sm: 'py-0.5',
    md: 'py-1',
    lg: 'py-2',
  };
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value, valKey)}
      className={`w-full px-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white dark:bg-dark-800 text-gray-900 dark:text-white ${textSizeClasses[size]} ${sizeClasses[size]} transition-all duration-200 ease-in-out`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
