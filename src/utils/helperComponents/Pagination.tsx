import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  totalItems?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
}

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  pageSize = 10,
  totalItems = 0,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 30],
  showPageSizeSelector = true,
}: PaginationProps) {

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const startItem = totalItems ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = totalItems ? Math.min(currentPage * pageSize, totalItems) : 0;

  return (
    <div className='flex flex-wrap items-center justify-between gap-4 py-4 px-2'>
      <div className='flex items-center gap-4 text-sm'>
        {totalItems !== undefined && (
          <span className='text-gray-500 dark:text-gray-400 font-medium'>
            Showing <span className='text-gray-900 dark:text-gray-200'>{startItem}</span>-
            <span className='text-gray-900 dark:text-gray-200'>{endItem}</span> of{' '}
            <span className='text-gray-900 dark:text-gray-200'>{totalItems}</span>
          </span>
        )}

        {showPageSizeSelector && onPageSizeChange && (
          <div className='flex items-center gap-2'>
            <span className='text-gray-500 dark:text-gray-400'>Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className='px-2 py-1 text-sm bg-transparent border-b-2 border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-gray-200 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer'
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 p-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">

        <div className="flex gap-1 pr-2 border-r border-gray-100 dark:border-gray-700">
          <NavButton
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            icon={<ChevronsLeft className='h-4 w-4' />}
          />
          <NavButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            icon={<ChevronLeft className='h-4 w-4' />}
          />
        </div>

        <div className='flex items-center gap-1'>
          {getPageNumbers().map((page, index) => (
            <div key={index} className="relative">
              {page === '...' ? (
                <span className='flex items-center justify-center w-8 h-8 text-gray-400 pb-2'>...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`
                    relative w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                    ${currentPage === page
                      ? 'text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <span className="relative z-10">{page}</span>
                  {currentPage === page && (
                    <motion.div
                      layoutId="paginationPill"
                      className="absolute inset-0 bg-gray-900 dark:bg-blue-600 rounded-lg shadow-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-1 pl-2 border-l border-gray-100 dark:border-gray-700">
          <NavButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            icon={<ChevronRight className='h-4 w-4' />}
          />
          <NavButton
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            icon={<ChevronsRight className='h-4 w-4' />}
          />
        </div>

      </div>
    </div>
  );
}

// Helper Component for Nav Buttons
const NavButton = ({ onClick, disabled, icon }: any) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className='p-2 rounded-lg text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200 transition-colors'
  >
    {icon}
  </button>
);
