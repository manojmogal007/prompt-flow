import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: number | string;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  text,
  position = 'top',
  width = 'max-content',
  delay = 0.2
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 10; // Space for arrow

      let x = 0;
      let y = 0;

      // Use fixed positioning relative to viewport
      switch (position) {
        case 'top':
          x = rect.left + rect.width / 2;
          y = rect.top - gap;
          break;
        case 'bottom':
          x = rect.left + rect.width / 2;
          y = rect.bottom + gap;
          break;
        case 'left':
          x = rect.left - gap;
          y = rect.top + rect.height / 2;
          break;
        case 'right':
          x = rect.right + gap;
          y = rect.top + rect.height / 2;
          break;
      }
      setCoords({ x, y });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  const cssTransformClass = {
    top: '-translate-x-1/2 -translate-y-full',
    bottom: '-translate-x-1/2',
    left: '-translate-x-full -translate-y-1/2',
    right: '-translate-y-1/2',
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-gray-900/90',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-gray-900/90',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-gray-900/90',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-gray-900/90',
  };

  // Animation variants
  const animations = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  return (
    <>
      <div
        ref={triggerRef}
        className="relative flex items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={handleMouseEnter}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>

      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              initial={animations.initial}
              animate={animations.animate}
              exit={animations.exit}
              transition={{ duration: 0.15, delay }}
              style={{
                left: coords.x,
                top: coords.y,
                position: 'fixed',
                width: typeof width === 'number' ? `${width}px` : width,
                maxWidth: '300px'
              }}
              className={`
                pointer-events-none z-[9999]
                px-3 py-2 rounded-lg
                bg-gray-900/90 dark:bg-black/90 backdrop-blur-sm
                text-xs text-white font-medium text-left
                shadow-xl border border-white/10
                whitespace-normal break-words leading-relaxed
                ${cssTransformClass[position]}
              `}
            >
              {text}

              {/* Arrow */}
              <div
                className={`absolute w-0 h-0 border-[6px] ${arrowClasses[position]}`}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
