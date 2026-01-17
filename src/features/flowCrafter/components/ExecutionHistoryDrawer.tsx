import React from 'react';
import { X, Clock, CheckCircle2, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { useGetExecutionRequestQuery } from '../../../utils/services/genericService';
import { useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useAuth } from '../../../auth/useAuth';

interface ExecutionHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExecution: (executionId: string) => void;
  workflowId?: string;
}

export const ExecutionHistoryDrawer: React.FC<ExecutionHistoryDrawerProps> = ({ isOpen, onClose, onSelectExecution, workflowId }) => {
  const { user } = useAuth();

  // Fetch execution history
  const historyQuery = useApiQuery(
    useGetExecutionRequestQuery,
    `/execution/executions?userId=${user?.id}&limit=20${workflowId ? `&workflowId=${workflowId}` : ''}`,
    {
      skipQuery: !user?.id || !isOpen,
    },
  );

  const executions = (historyQuery.data as any)?.executions || [];
  const isLoading = historyQuery.isLoading;

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[60] flex justify-end'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity' onClick={onClose} />

      {/* Drawer */}
      <div className='relative w-full max-w-md bg-white dark:bg-dark-800 shadow-2xl h-full flex flex-col border-l border-gray-200 dark:border-dark-700 transform transition-transform duration-300 ease-in-out'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700'>
          <div className='flex items-center gap-2'>
            <Clock className='w-5 h-5 text-gray-500 dark:text-gray-400' />
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>Run History</h2>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors'>
            <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-4 space-y-3'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-10 text-gray-500 gap-2'>
              <Loader2 className='w-6 h-6 animate-spin' />
              <span className='text-sm'>Loading history...</span>
            </div>
          ) : executions.length === 0 ? (
            <div className='text-center py-10 text-gray-500 dark:text-gray-400'>
              <p>No executions found yet.</p>
            </div>
          ) : (
            executions.map((execution: any) => (
              <button
                key={execution._id}
                onClick={() => onSelectExecution(execution._id)}
                className='w-full text-left p-4 bg-gray-50 dark:bg-dark-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-gray-200 dark:border-dark-700 rounded-xl transition-all group group-hover:border-blue-200 dark:group-hover:border-blue-800'
              >
                <div className='flex items-start justify-between mb-2'>
                  <div className='flex items-center gap-2'>
                    {execution.status === 'completed' && <CheckCircle2 className='w-4 h-4 text-green-500' />}
                    {execution.status === 'failed' && <AlertCircle className='w-4 h-4 text-red-500' />}
                    {execution.status === 'running' && <Loader2 className='w-4 h-4 text-blue-500 animate-spin' />}
                    {execution.status === 'pending' && <Clock className='w-4 h-4 text-yellow-500' />}
                    {execution.status === 'cancelled' && <X className='w-4 h-4 text-gray-500' />}

                    <span
                      className={`text-sm font-medium capitalize
                      ${execution.status === 'completed' ? 'text-green-700 dark:text-green-400' : ''}
                      ${execution.status === 'failed' ? 'text-red-700 dark:text-red-400' : ''}
                      ${execution.status === 'running' ? 'text-blue-700 dark:text-blue-400' : ''}
                    `}
                    >
                      {execution.status}
                    </span>
                  </div>
                  <span className='text-xs text-gray-400 font-mono'>{new Date(execution.createdAt).toLocaleDateString()}</span>
                </div>

                <div className='mb-1'>
                  <span className='font-semibold text-gray-800 dark:text-gray-200 block truncate'>
                    {execution.executionName || 'Execution'}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-xs text-gray-500 dark:text-gray-400 line-clamp-1'>
                    {execution.initialInput
                      ? execution.initialInput.substring(0, 50) + (execution.initialInput.length > 50 ? '...' : '')
                      : 'No input'}
                  </div>
                  <ChevronRight className='w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors' />
                </div>

                <div className='mt-2 text-xs text-gray-400 flex gap-3'>
                  <span>{new Date(execution.createdAt).toLocaleTimeString()}</span>
                  {execution.executionTime && (
                    <span className='flex items-center'>
                      <Clock className='w-3 h-3 text-gray-400 mr-1' /> {(execution.executionTime / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
