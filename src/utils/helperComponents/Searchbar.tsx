import { type FC, useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

interface Props {
  value: any;
  handleInput: any;
  type?: any;
  placeholder: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Searchbar: FC<Props> = ({ value, handleInput, type = 'text', placeholder, size = 'md' }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const sizes = {
    sm: { height: 'h-8', icon: 'w-3.5 h-3.5', text: 'text-xs' },
    md: { height: 'h-10', icon: 'w-4 h-4', text: 'text-sm' },
    lg: { height: 'h-12', icon: 'w-5 h-5', text: 'text-base' },
  };

  const currentSize = sizes[size];

  return (
    <div
      className={`
            relative flex items-center w-full transition-all duration-200
            ${isFocused ? 'ring-2 ring-blue-500/20 shadow-lg shadow-blue-500/10' : 'hover:ring-2 hover:ring-gray-200 dark:hover:ring-gray-700/50'}
            rounded-xl
        `}
    >
      <div className={`absolute left-3 flex items-center pointer-events-none transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>
        <Search className={currentSize.icon} />
      </div>

      <input
        ref={inputRef}
        value={value || ''}
        onChange={(e) => handleInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        type={type}
        className={`
            w-full bg-gray-50 dark:bg-dark-800/50 
            border border-gray-200 dark:border-dark-700 
            text-gray-900 dark:text-gray-100 
            placeholder-gray-400 dark:placeholder-gray-500
            rounded-xl
            pl-10 pr-12
            ${currentSize.height} ${currentSize.text}
            focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-dark-800
            transition-all duration-200
        `}
        placeholder={placeholder}
      />

      {/* <div className="absolute right-3 flex items-center gap-1 pointer-events-none">
        <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-[10px] font-medium text-gray-500 dark:text-gray-400 font-sans">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div> */}
    </div>
  );
};
