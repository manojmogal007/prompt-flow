import React from 'react';
import { Trash2, Calendar, User, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router';
import Loader from '../../../utils/helperComponents/Loader';
import { encodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import { useApiMutation } from '../../../utils/customHooks/apiHooks';
import { usePostWorkflowsDeleteRequestMutation } from '../../../utils/services/genericService';
import { useToast } from '../../../hooks/useToast';

interface Props {
  workflows: any[];
  activeTab: string;
  isLoading?: boolean;
}

export const WorkflowsTable: React.FC<Props> = ({ workflows = [], activeTab, isLoading = false }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const { handleTrigger } = useApiMutation(usePostWorkflowsDeleteRequestMutation, '/workflow/deleteWorkflow', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
    },
    onError: (error: any) => {
      showToast(error?.data?.message, 'error');
    },
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAction = async (workflow: any) => {
    await handleTrigger({ workflowId: workflow._id });
  };

  const handleNavigate = (id: string, name: string) => {
    console.log(name, id);
    navigate(`/prompt-flow/workflows/${encodeNameAndId(name, id)}`);
  };
  return (
    <div className='w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 dark:bg-gray-700'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Workflow
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                No of steps
              </th>
              {activeTab === 'contributions' && (
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Role</th>
              )}
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Created</th>
              {activeTab === 'personal' && (
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
            {isLoading ? (
              <tr>
                <td colSpan={4} className='px-6 py-12 text-center'>
                  <Loader />
                </td>
              </tr>
            ) : (
              workflows.map((workflow) => (
                <tr
                  key={workflow._id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer`}
                  onClick={() => handleNavigate(workflow._id, workflow.name)}
                >
                  {/* Workflow Name & Info */}
                  <td className='px-6 py-4'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0'>
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            activeTab === 'personal' ? 'bg-blue-100' : 'bg-green-100'
                          }`}
                        >
                          <GitBranch className={`w-5 h-5 ${activeTab === 'personal' ? 'text-blue-600' : 'text-green-600'}`} />
                        </div>
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>{workflow.name}</div>
                        <div className='text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1'>
                          <User className='w-3 h-3 mr-1' />
                          {workflow.createdBy}
                          {activeTab === 'contributions' && (
                            <span className='ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full'>Community</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Components Count */}
                  <td className='px-6 py-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='flex items-center space-x-1'>
                        <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                        <span className='text-sm text-gray-900 dark:text-gray-100'>{workflow.workflowJson.nodes.length} steps</span>
                      </div>
                    </div>
                  </td>

                  {activeTab === 'contributions' && (
                    <td className='px-6 py-4'>
                      <div className='flex items-center text-sm text-gray-900 dark:text-gray-100 capitalize'>{workflow?.role || 'N/A'}</div>
                    </td>
                  )}
                  {/* Created Date */}
                  <td className='px-6 py-4'>
                    <div className='flex items-center text-sm text-gray-900 dark:text-gray-100'>
                      <Calendar className='w-4 h-4 mr-2 text-gray-400 dark:text-gray-500' />
                      {formatDate(workflow.createdAt)}
                    </div>
                    <div className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Updated: {formatDate(workflow.updatedAt)}</div>
                  </td>

                  {/* Actions */}
                  {activeTab === 'personal' && (
                    <td className='px-6 py-4'>
                      <div className='flex items-center space-x-2'>
                        {activeTab === 'personal' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(workflow);
                              }}
                              className='p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                              title='Delete Workflow'
                            >
                              <Trash2 className='w-4 h-4' />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!isLoading && workflows.length === 0 && (
        <div className='text-center py-12'>
          <GitBranch className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
          <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
            No {activeTab === 'personal' ? 'personal' : 'community'} workflows
          </h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {activeTab === 'personal' ? 'Create your first workflow to get started.' : 'No community workflows available yet.'}
          </p>
        </div>
      )}
    </div>
  );
};
