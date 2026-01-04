import { NotebookPen, Plus } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { ModalV2 } from '../../../utils/helperComponents/ModalV2';
import { useApiMutation } from '../../../utils/customHooks/apiHooks';
import { usePostStepsRequestMutation, usePutStepsRequestMutation } from '../../../utils/services/genericService';
import { useAuth } from '../../../auth/useAuth';
import { useToast } from '../../../hooks/useToast';
import { createPortal } from 'react-dom';

interface Props {
  editStep?: any;
  setEditstep?: any;
}

export const AddCustomStep: React.FC<Props> = ({ editStep, setEditstep }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    setFormData({ ...editStep });
    setOpenModal(editStep?.edit || false);
  }, [editStep]);

  const { handleTrigger, isLoading } = useApiMutation(usePostStepsRequestMutation, '/steps/addCustomStep', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
      setOpenModal(false);
    },
    onError: () => {
      showToast('Something went wrong', 'error');
    },
  });
  const { handleTrigger: handleEditTrigger, isLoading: isEditLoading } = useApiMutation(usePutStepsRequestMutation, '/steps/updateStep', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
      setOpenModal(false);
    },
    onError: () => {
      showToast('Something went wrong', 'error');
    },
  });

  const validateFields = useMemo(() => {
    return !!(formData?.name?.trim()?.length && formData?.prompt?.trim()?.length);
  }, [formData]);

  const handleCustomStepModal = () => {
    console.log('Opening custom step modal, current state:', openModal);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    console.log('Closing custom step modal');
    setOpenModal(false);
    setEditstep({});
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, key: string) => {
    setFormData({ ...formData, [key]: e.target.value });
  };

  const triggerAddCustomStep = async () => {
    if (isLoading || !validateFields || isEditLoading) return;
    const payLoad = { ...formData, creatorId: user.id, ...(editStep?.edit && { stepId: editStep._id }) };
    if (editStep?.edit) {
      await handleEditTrigger(payLoad);
    } else await handleTrigger(payLoad);
    setEditstep({});
  };

  const customStepModal = (
    <ModalV2 isOpen={openModal} onClose={handleCloseModal}>
      <div className='w-full max-w-lg'>
        {/* Header */}
        <div className='text-center mb-6'>
          <div className='mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4'>
            <NotebookPen className='w-8 h-8 text-white' />
          </div>
          <h3 className='text-2xl font-bold text-slate-800 dark:text-dark-100 mb-2'>
            {editStep?.edit ? 'Update Custom Step' : 'Create Custom Step'}
          </h3>
          <p className='text-slate-500 dark:text-dark-400'>
            {editStep?.edit ? 'Modify your custom step details' : 'Add a new step to your workflow library'}
          </p>
          {process.env.NODE_ENV === 'development' && <p className='text-xs text-gray-500 mt-2'>Modal is open: {openModal.toString()}</p>}
        </div>

        {/* Form */}
        <div className='space-y-6'>
          {/* Step Name */}
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-slate-700 dark:text-dark-300 flex items-center'>
              <span className='w-2 h-2 bg-green-500 rounded-full mr-2'></span>
              Step Name
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <input
              value={formData?.name || ''}
              onChange={(e) => handleInput(e, 'name')}
              type='text'
              className='w-full px-4 py-3 border border-slate-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-slate-400 dark:placeholder-dark-500 bg-white dark:bg-dark-800 text-slate-900 dark:text-dark-100'
              placeholder='Enter a descriptive name for your step'
            />
          </div>

          {/* Prompt */}
          <div className='space-y-2'>
            <label className='text-sm font-semibold text-slate-700 dark:text-dark-300 flex items-center'>
              <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
              AI Prompt
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <div className='relative'>
              <textarea
                value={formData?.prompt || ''}
                onChange={(e) => handleInput(e, 'prompt')}
                rows={5}
                className='w-full px-4 py-3 border border-slate-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 placeholder-slate-400 dark:placeholder-dark-500 bg-white dark:bg-dark-800 text-slate-900 dark:text-dark-100 resize-none'
                placeholder='Describe what this step should do...'
              />
              <div className='absolute bottom-2 right-2 text-xs text-slate-400 dark:text-dark-500'>
                {(formData?.prompt || '').length} characters
              </div>
            </div>
          </div>

          {/* Category (Optional) */}
          {/* <div className='space-y-2'>
            <label className='text-sm font-semibold text-slate-700 flex items-center'>
              <span className='w-2 h-2 bg-purple-500 rounded-full mr-2'></span>
              Category (Optional)
            </label>
            <select
              value={formData?.category || ''}
              onChange={(e) => handleInput(e, 'category')}
              className='w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-slate-900'
            >
              <option value=''>Select a category</option>
              <option value='Text Processing'>Text Processing</option>
              <option value='Data Analysis'>Data Analysis</option>
              <option value='Content Generation'>Content Generation</option>
              <option value='Summarization'>Summarization</option>
              <option value='Translation'>Translation</option>
              <option value='Other'>Other</option>
            </select>
          </div> */}
        </div>

        {/* Actions */}
        <div className='flex items-center justify-between pt-6 border-t border-slate-200 dark:border-dark-700 mt-6'>
          <button
            onClick={handleCloseModal}
            className='px-6 py-3 text-slate-600 dark:text-dark-300 hover:text-slate-800 dark:hover:text-dark-100 hover:bg-slate-100 dark:hover:bg-dark-700 rounded-xl transition-colors font-medium'
          >
            Cancel
          </button>

          <div className='flex items-center space-x-3'>
            {/* {!validateFields && (
              <div className='flex items-center text-xs text-slate-500'>
                <span className='w-1.5 h-1.5 bg-slate-400 rounded-full mr-2'></span>
                Fill in required fields
              </div>
            )} */}
            <button
              disabled={!validateFields || isLoading || isEditLoading}
              onClick={triggerAddCustomStep}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                !validateFields || isLoading || isEditLoading
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              }`}
            >
              {isLoading || isEditLoading ? (
                <div className='flex items-center space-x-2'>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                  <span>{editStep?.edit ? 'Updating...' : 'Creating...'}</span>
                </div>
              ) : (
                <div className='flex items-center space-x-2'>
                  <NotebookPen className='w-4 h-4' />
                  <span>{editStep?.edit ? 'Update Step' : 'Create Step'}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </ModalV2>
  );
  return (
    <>
      <button
        onClick={handleCustomStepModal}
        className='p-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors cursor-pointer border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700'
        title={editStep?.edit ? 'Edit Step' : 'Add Custom Step'}
      >
        <Plus className='h-4 w-4' />
      </button>
      {createPortal(customStepModal, document.body)}
    </>
  );
};
