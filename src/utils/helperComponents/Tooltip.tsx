import React, { useState } from 'react';
import type { ReactNode } from 'react';
interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text, position = 'top', width = 200 }) => {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className='relative flex items-center' onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div
          className={`absolute bg-gray-800 text-white text-sm px-3 py-1 rounded-lg shadow-md transition-opacity duration-200 
          whitespace-normal break-words w-[${width}px] ${positionClasses[position]} z-1000 flex items-center `}
        >
          <span className='text-xs mb-1'>{text}</span>
        </div>
      )}
    </div>
  );
};
