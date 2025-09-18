import  { type FC } from 'react';

interface Props {
  triggerClick: () => void;
  disabled?: boolean;
  label: string;
  icon?: any;
  size?: 'sm' | 'md' | 'lg';
  extraClasses?: string;
  isHollow?: boolean;
  color?: string;
}
const colors: Record<string, string> = {
  blue: 'bg-blue-600 text-white hover:bg-blue-700 border-blue-600',
  red: 'bg-red-600 text-white hover:bg-red-700 border-red-600',
  green: 'bg-green-600 text-white hover:bg-green-700 border-green-600',
  yellow: 'bg-yellow-500 text-black hover:bg-yellow-600 border-yellow-500',
  purple: 'bg-purple-600 text-white hover:bg-purple-700 border-purple-600',
  pink: 'bg-pink-600 text-white hover:bg-pink-700 border-pink-600',
  indigo: 'bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600',
  gray: 'bg-gray-600 text-white hover:bg-gray-700 border-gray-600',
  teal: 'bg-teal-600 text-white hover:bg-teal-700 border-teal-600',
  orange: 'bg-orange-600 text-white hover:bg-orange-700 border-orange-600',
};

const hollowColors: Record<string, string> = {
  blue: 'text-blue-600 border-blue-600',
  red: 'text-red-600 border-red-600',
  green: 'text-green-600 border-green-600',
  yellow: 'text-yellow-500 border-yellow-500',
  purple: 'text-purple-600 border-purple-600',
  pink: 'text-pink-600 border-pink-600',
  indigo: 'text-indigo-600 border-indigo-600',
  gray: 'text-gray-600 border-gray-600',
  teal: 'text-teal-600 border-teal-600',
  orange: 'text-orange-600 border-orange-600',
};

const Button: FC<Props> = ({ triggerClick, label, disabled, icon, size = 'md', extraClasses = '', isHollow, color = 'blue' }) => {
  const Icon = icon;
  const sizeClasses = {
    sm: 'h-6 px-2 text-[12px]',
    md: 'h-8 px-4 text-[14px]',
    lg: 'h-10 px-6 text-[16px]',
  };
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  const hollowClasses = isHollow ? `bg-transparent ${hollowColors[color]}` : colors[color];
  return (
    <button
      disabled={disabled}
      onClick={triggerClick}
      className={`flex items-center border rounded-lg font-semibold cursor-pointer disabled:cursor-not-allowed ${hollowClasses} ${sizeClasses[size]} ${extraClasses}`}
    >
      {icon && <Icon className={`mr-2 ${iconSizes[size]}`} />}
      {label}
    </button>
  );
};

export default Button;
