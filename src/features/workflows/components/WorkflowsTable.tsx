import React, { useState } from 'react';
import { Trash2, User, Workflow, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { encodeNameAndId, formatDate } from '../../../utils/helperFunctions/HelperFunctions';
import { useApiMutation } from '../../../utils/customHooks/apiHooks';
import { usePostWorkflowsDeleteRequestMutation } from '../../../utils/services/genericService';
import { useToast } from '../../../hooks/useToast';
import { ModeSelectionModal } from './ModeSelectionModal';
import { useSettings } from '../../../hooks/useSettings';

interface Props {
  workflows: any[];
  activeTab: string;
  isLoading?: boolean;
}

export const WorkflowsTable: React.FC<Props> = ({ workflows = [], activeTab, isLoading = false }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isLiveRoomsEnabled } = useSettings();
  const [selectedWorkflow, setSelectedWorkflow] = useState<{ id: string; name: string } | null>(null);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);

  const { handleTrigger } = useApiMutation(usePostWorkflowsDeleteRequestMutation, '/workflow/deleteWorkflow', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
    },
    onError: (error: any) => {
      showToast(error?.data?.message, 'error');
    },
  });

  const handleAction = async (e: React.MouseEvent, workflow: any) => {
    e.stopPropagation();
    await handleTrigger({ workflowId: workflow._id });
  };

  const handleNavigate = (id: string, name: string) => {
    if (!isLiveRoomsEnabled) return navigate(`/prompt-flow/workflows/local/${encodeNameAndId(name, id)}`);
    setSelectedWorkflow({ id, name });
    setIsModeModalOpen(true);
  };

  const handleModeSelect = (mode: 'local' | 'collab') => {
    if (!selectedWorkflow) return;
    const { id, name } = selectedWorkflow;
    const encoded = encodeNameAndId(name, id);

    navigate(`/prompt-flow/workflows/${mode}/${encoded}`);
    setIsModeModalOpen(false);
    setSelectedWorkflow(null);
  };

  if (isLoading && workflows.length === 0) {
    return (
      <div className='space-y-3'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse' />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className='w-full space-y-3 px-3 mt-3'>
        {workflows.length === 0 ? (
          <div className='text-center py-16 bg-gray-50 dark:bg-dark-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-700'>
            <div className='w-16 h-16 mx-auto bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mb-4'>
              <Workflow className='h-8 w-8 text-gray-400 dark:text-dark-400' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-dark-100'>No workflows found</h3>
            <p className='mt-1 text-sm text-gray-500 dark:text-dark-400 max-w-sm mx-auto'>
              {activeTab === 'personal'
                ? 'Get started by creating your first workflow above.'
                : 'Explore community workflows to get inspired.'}
            </p>
          </div>
        ) : (
          workflows.map((workflow, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              key={workflow._id}
              onClick={() => handleNavigate(workflow._id, workflow.name)}
              className='group relative flex items-center justify-between p-4 bg-white dark:bg-dark-800 rounded-xl border border-gray-100 dark:border-dark-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all duration-200 cursor-pointer'
            >
              {/* Left: Icon & Info */}
              <div className='flex items-center gap-4 flex-1'>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    activeTab === 'personal'
                      ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400'
                  }`}
                >
                  <Workflow className='w-6 h-6' />
                </div>

                <div className='min-w-0'>
                  {activeTab === 'personal' ? (
                    <h4 className='text-base font-semibold text-gray-900 dark:text-dark-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                      {workflow.name}
                    </h4>
                  ) : (
                    <h4 className='text-base font-semibold text-gray-900 dark:text-dark-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors'>
                      {workflow.name}
                    </h4>
                  )}
                  <p className='text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5'>
                    {workflow.description || 'No description available'}
                  </p>
                </div>
              </div>

              {/* Right: Meta & Actions */}
              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-6 hidden sm:flex'>
                  <div className='text-right'>
                    <div className='text-sm font-medium text-gray-700 dark:text-dark-200'>
                      {workflow?.workflowJson?.nodes?.length || 0} Steps
                    </div>
                    <div className='text-xs text-gray-400 dark:text-dark-500 flex items-center justify-end gap-1 mt-0.5'>
                      <User className='w-3 h-3' />
                      {workflow.createdBy || 'Unknown'}
                    </div>
                  </div>

                  <div className='h-8 w-px bg-gray-200 dark:bg-gray-700'></div>

                  <div className='text-right'>
                    <div className='text-sm font-medium text-gray-700 dark:text-dark-200'>{formatDate(workflow.updatedAt, true)}</div>
                    <div className='text-xs text-gray-400 dark:text-dark-500 flex items-center justify-end gap-1 mt-0.5'>
                      <Clock className='w-3 h-3' />
                      Updated
                    </div>
                  </div>
                </div>

                {activeTab === 'personal' ? (
                  <div className='flex items-center gap-2'>
                    <button
                      onClick={(e) => handleAction(e, workflow)}
                      className='p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'
                      title='Delete'
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                    <ChevronRight className='w-5 h-5 text-gray-300 dark:text-dark-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                  </div>
                ) : (
                  <ChevronRight className='w-5 h-5 text-gray-300 dark:text-dark-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200' />
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <ModeSelectionModal isOpen={isModeModalOpen} onClose={() => setIsModeModalOpen(false)} onSelect={handleModeSelect} />
    </>
  );
};
