import React from 'react';
import { MousePointer2 } from 'lucide-react';

interface CursorProps {
  x: number;
  y: number;
  color: string;
  name: string;
}

export const Cursor: React.FC<CursorProps> = ({ x, y, color, name }) => {
  return (
    <div
      className='pointer-events-none absolute top-0 left-0 z-50'
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
        transition: 'transform 0.15s cubic-bezier(0.17, 0.67, 0.83, 0.67)',
      }}
    >
      <div className='relative'>
        <MousePointer2
          className='h-4 w-4 drop-shadow-lg'
          style={{
            fill: color,
            color: color,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
        />

        <div
          className='absolute left-5 top-2 px-2.5 py-1 rounded-md text-xs font-medium text-white shadow-lg whitespace-nowrap backdrop-blur-sm'
          style={{
            backgroundColor: color,
            boxShadow: `0 4px 12px ${color}40, 0 2px 4px rgba(0,0,0,0.2)`,
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
};
