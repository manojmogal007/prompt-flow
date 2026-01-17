import React, { useMemo, useState } from 'react';
import { useApiMutation } from '../../../utils/customHooks/apiHooks';
import { usePostWorkflowRequestMutation, useUpdateWorkflowRequestMutation } from '../../../utils/services/genericService';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../auth/useAuth';
import InviteContributors from './InviteContributors';
import { useNavigate, useParams } from 'react-router';
import { decodeNameAndId, encodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import { SaveAll, ArrowLeftFromLine, SquarePen, Play, Clock, Users, Zap, Workflow, Loader2 } from 'lucide-react';
import { Modal } from '../../../utils/helperComponents/Modal';
import DetailsTaker from './DetailsTaker';

interface ModernHeaderProps {
  nodes: any[];
  edges: any[];
  userRole: string;
  formData: any;
  collaborators: any;
  handleFormDataChange: any;
  onExecute?: () => void;
  onHistory?: () => void;
  isExecuting?: boolean;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  nodes,
  edges,
  userRole,
  formData,
  handleFormDataChange,
  collaborators = [],
  onExecute,
  onHistory,
  isExecuting,
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { encodedParams } = useParams();
  const { id: workflowId } = decodeNameAndId(encodedParams);
  const isNewWorkflow = encodedParams === 'new' || false;
  const [open, setOpen] = useState(false);

  const saveWorkflow = useApiMutation(usePostWorkflowRequestMutation, '/workflow/createWorkflow', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
      navigate(`/prompt-flow/workflows/${encodeNameAndId(data?.workflow?.name, data?.workflow?._id)}`);
    },
    onError: () => {
      showToast('Something went wrong', 'error');
    },
  });

  const updateWorkflow = useApiMutation(useUpdateWorkflowRequestMutation, '/workflow/updateWorkflow', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
    },
    onError: () => {
      showToast('Something went wrong', 'error');
    },
  });

  const payloadValidation = useMemo(() => {
    if (formData.name && nodes.length) return false;
    return true;
  }, [formData, nodes]);

  const handleToggle = () => {
    setOpen((prev: boolean) => !prev);
  };

  const triggerSaveWorkflow = async () => {
    if (payloadValidation || saveWorkflow?.isLoading || updateWorkflow?.isLoading) return;
    const payload = {
      name: formData.name,
      description: formData.description,
      email: user?.email,
      workflowJson: {
        nodes,
        edges,
      },
      ...(workflowId && { workflowId }),
      creatorId: user?.id,
      createdBy: `${user?.firstName} ${user?.lastName}`,
    };
    if (isNewWorkflow) {
      await saveWorkflow?.handleTrigger(payload);
    } else await updateWorkflow?.handleTrigger(payload);

    setOpen(false);
  };

  const triggerBack = () => {
    navigate(-1);
  };

  const handleChange = (val: string, key: string) => {
    handleFormDataChange({ ...formData, [key]: val });
  };

  const handleSaveOrOpen = () => {
    if (isNewWorkflow) handleToggle();
    else triggerSaveWorkflow();
  };

  const handleExecute = () => {
    if (nodes.length < 2) {
      showToast('Workflow must have at least 2 nodes to execute', 'warning');
      return;
    }
    onExecute?.();
  };

  // const exportWorkflow = () => {
  //   const workflowData = {
  //     name: formData.name,
  //     description: formData.description,
  //     nodes,
  //     edges,
  //     exportedAt: new Date().toISOString(),
  //   };

  //   const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `${formData.name || 'workflow'}_export.json`;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   URL.revokeObjectURL(url);

  //   showToast('Workflow exported successfully', 'success');
  // };

  // const importWorkflow = () => {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = '.json';
  //   input.onchange = (e) => {
  //     const file = (e.target as HTMLInputElement).files?.[0];
  //     if (file) {
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         try {
  //           const data = JSON.parse(e.target?.result as string);
  //           // Handle imported workflow data
  //           showToast('Workflow imported successfully', 'success');
  //         } catch (error) {
  //           showToast('Invalid workflow file', 'error');
  //         }
  //       };
  //       reader.readAsText(file);
  //     }
  //   };
  //   input.click();
  // };

  // const resetWorkflow = () => {
  //   if (window.confirm('Are you sure you want to reset the workflow? This action cannot be undone.')) {
  //     // Reset logic here
  //     showToast('Workflow reset', 'info');
  //   }
  // };

  return (
    <div className='bg-white dark:bg-dark-900 border-b border-slate-200 dark:border-dark-700 shadow-sm sticky top-16 z-40'>
      <div className='px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-3'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg'>
                <Workflow className='w-5 h-5 text-white' />
              </div>
              <div>
                <div className='flex items-center space-x-2'>
                  <h1 className='text-xl font-semibold text-slate-800 dark:text-dark-100'>{formData.name || 'Untitled Workflow'}</h1>
                  {!isNewWorkflow && (
                    <button onClick={handleToggle} className='p-1 hover:bg-slate-100 dark:hover:bg-dark-800 rounded-lg transition-colors'>
                      <SquarePen className='w-4 h-4 text-slate-500 dark:text-dark-400' />
                    </button>
                  )}
                </div>
                <p className='text-sm text-slate-500 dark:text-dark-400'>{formData.description || 'No description provided'}</p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <span className='text-sm text-slate-600 dark:text-dark-300'>{nodes.length} nodes</span>
              </div>

              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                <span className='text-sm text-slate-600 dark:text-dark-300'>{edges.length} connections</span>
              </div>

              {collaborators.length > 0 && (
                <div className='flex items-center space-x-2'>
                  <Users className='w-4 h-4 text-slate-500' />
                  <span className='text-sm text-slate-600 dark:text-dark-300'>{collaborators.length} collaborators</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Actions */}
          <div className='flex items-center space-x-3'>
            {/* Preview Toggle */}
            {/* <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                showPreview
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-dark-700'
              }`}
            >
              {showPreview ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              <span className='text-sm font-medium'>Preview</span>
            </button> */}

            {/* History Button */}
            <button
              onClick={() => onHistory?.()}
              className='flex items-center space-x-2 px-3 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-dark-800 dark:text-dark-300 dark:hover:bg-dark-700 rounded-lg font-medium transition-colors'
            >
              <Clock className='w-4 h-4' />
              <span>History</span>
            </button>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={nodes.length < 2 || isExecuting}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg font-medium transition-colors ${nodes.length < 2 || isExecuting
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-dark-800 dark:text-dark-500'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg'
                }`}
            >
              {isExecuting ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className='w-4 h-4' />
                  <span>Execute</span>
                </>
              )}
            </button>

            {/* More Actions Dropdown */}
            {/* <div className='relative group'>
              <button className='p-2 hover:bg-slate-100 rounded-lg transition-colors'>
                <Settings className='w-5 h-5 text-slate-600' />
              </button>

              <div className='absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
                <div className='py-2'>
                  <button
                    onClick={exportWorkflow}
                    className='w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors'
                  >
                    <Download className='w-4 h-4' />
                    <span>Export Workflow</span>
                  </button>

                  <button
                    onClick={importWorkflow}
                    className='w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors'
                  >
                    <Upload className='w-4 h-4' />
                    <span>Import Workflow</span>
                  </button>

                  <button
                    onClick={resetWorkflow}
                    className='w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors'
                  >
                    <RotateCcw className='w-4 h-4' />
                    <span>Reset Workflow</span>
                  </button>
                </div>
              </div>
            </div> */}

            {/* Save Button */}
            <button
              onClick={handleSaveOrOpen}
              disabled={nodes.length === 0 || saveWorkflow?.isLoading || updateWorkflow?.isLoading}
              className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg font-medium transition-colors ${nodes.length === 0 || saveWorkflow?.isLoading || updateWorkflow?.isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              <SaveAll className='w-4 h-4' />
              <span>{saveWorkflow?.isLoading || updateWorkflow?.isLoading ? 'Saving...' : 'Save'}</span>
            </button>

            {/* Exit Button */}
            <button
              onClick={triggerBack}
              className='flex items-center space-x-2 px-4 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors'
            >
              <ArrowLeftFromLine className='w-4 h-4' />
              <span>Exit</span>
            </button>

            {/* Invite Contributors */}
            {userRole === 'owner' && (
              <div className='ml-2'>
                <InviteContributors />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for workflow details */}
      <Modal isOpen={open} onClose={handleToggle}>
        <div className='mb-6 text-center'>
          <div className='mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4'>
            <Zap className='w-6 h-6 text-blue-600 dark:text-blue-400' />
          </div>
          <h3 className='text-xl font-semibold text-slate-800 dark:text-dark-100'>
            {isNewWorkflow ? 'Create New Workflow' : 'Update Workflow'}
          </h3>
          <p className='text-sm text-slate-500 dark:text-dark-400 mt-1'>
            {isNewWorkflow ? 'Set up your new workflow details' : 'Modify your workflow information'}
          </p>
        </div>

        <DetailsTaker
          handleClose={handleToggle}
          name={formData.name}
          description={formData.description}
          handleSave={triggerSaveWorkflow}
          handleChange={handleChange}
          validation={payloadValidation}
        />
      </Modal>
    </div>
  );
};

export default ModernHeader;
