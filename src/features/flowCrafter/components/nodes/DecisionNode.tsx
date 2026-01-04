import React from 'react';
import { GitBranch, CheckCircle, XCircle, Settings } from 'lucide-react';
import { Handle } from '@xyflow/react';

export const DecisionNode: React.FC<any> = (props) => {
  const { data } = props;
  // const [selectedCondition, setSelectedCondition] = useState(data?.condition || 'if');

  const nodeName = data?.name || 'Decision';
  // const conditions = data?.conditions || [
  //   { id: 'if', label: 'If', description: 'Condition is true' },
  //   { id: 'else', label: 'Else', description: 'Condition is false' },
  // ];

  return (
    <div className='group relative border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px] max-w-[400px] border-l-4 border-l-orange-500 hover:border-l-orange-600'>
      {/* Connection handles */}
      <Handle
        type='source'
        position={'top' as any}
        id='a'
        className='!w-3 !h-3 !bg-orange-500 hover:!bg-orange-600 !border-2 !border-white !shadow-lg'
        style={{ background: '#f97316' }}
      />
      <Handle
        type='source'
        position={'right' as any}
        id='b'
        className='!w-3 !h-3 !bg-green-500 hover:!bg-green-600 !border-2 !border-white !shadow-lg'
        style={{ background: '#10b981' }}
      />
      <Handle
        type='source'
        position={'left' as any}
        id='c'
        className='!w-3 !h-3 !bg-red-500 hover:!bg-red-600 !border-2 !border-white !shadow-lg'
        style={{ background: '#ef4444' }}
      />

      {/* Header with gradient background */}
      <div className='bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 px-4 py-3 border-b border-orange-200 dark:border-orange-900/50 rounded-t-xl'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 flex-1'>
            <div className='p-1.5 bg-orange-500 rounded-lg'>
              <GitBranch className='w-4 h-4 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-semibold text-orange-800 dark:text-orange-100 truncate'>{nodeName}</h3>
              <div className='flex items-center space-x-2'>
                <span className='text-xs bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-200 px-2 py-0.5 rounded-full'>
                  Decision
                </span>
                <span className='text-xs text-orange-600 dark:text-orange-300'>Conditional Logic</span>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-1'>
            <button
              className='p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-900/50 rounded-lg transition-colors duration-200'
              title='Settings'
            >
              <Settings className='w-3 h-3' />
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className='p-4 space-y-3'>
        <div className='space-y-3'>
          <div>
            <label className='text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1 mb-2'>
              <GitBranch className='w-3 h-3 text-orange-600' />
              <span>Condition Logic</span>
            </label>
            <div className='bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3'>
              <p className='text-sm text-gray-700 dark:text-gray-300'>{data?.conditionText || 'Define your condition here...'}</p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-2'>
              <div className='flex items-center space-x-1 mb-1'>
                <CheckCircle className='w-3 h-3 text-green-600 dark:text-green-400' />
                <span className='text-xs font-medium text-green-700 dark:text-green-200'>True Path</span>
              </div>
              <p className='text-xs text-green-600 dark:text-green-300'>Execute when condition is true</p>
            </div>
            <div className='bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-2'>
              <div className='flex items-center space-x-1 mb-1'>
                <XCircle className='w-3 h-3 text-red-600 dark:text-red-400' />
                <span className='text-xs font-medium text-red-700 dark:text-red-200'>False Path</span>
              </div>
              <p className='text-xs text-red-600 dark:text-red-300'>Execute when condition is false</p>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className='flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700'>
          <div className='flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400'>
            <div className='w-2 h-2 bg-orange-500 rounded-full animate-pulse'></div>
            <span>Waiting for input</span>
          </div>
          <div className='text-xs text-gray-500 dark:text-gray-400'>Decision Node</div>
        </div>
      </div>
    </div>
  );
};

export default DecisionNode;
