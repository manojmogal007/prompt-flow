import  { type FC } from 'react';
import { Search } from 'lucide-react';
interface Props {
  value: any;
  handleInput: any;
  type?: any;
  placeholder: string;
  size?: string;
}

export const Searchbar: FC<Props> = ({ value, handleInput, type = 'text', placeholder, size = 'md' }) => {
  const styleClasses: any = {
    sm: 'py-0.5',
    md: 'py-1',
    lg: 'py-2',
  };

  const iconSizes: any = {
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-5 h-5',
  };
  return (
    <div className='relative'>
      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
        <Search className={`${iconSizes[size]} text-gray-400 dark:text-gray-500`} />
      </div>
      <input
        value={value || ''}
        onChange={(e) => handleInput(e.target.value)}
        type={type}
        className={`block w-full pl-10 pr-3 ${styleClasses[size]} border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
        placeholder={placeholder}
      />
    </div>
  );
};
