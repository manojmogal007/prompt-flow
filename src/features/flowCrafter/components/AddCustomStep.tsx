import { NotebookPen, Plus } from 'lucide-react';
import React, { use, useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../utils/helperComponents/Modal';
import { useApiMutation } from '../../../utils/customHooks/apiHooks';
import { usePostStepsRequestMutation, usePutStepsRequestMutation } from '../../../utils/services/genericService';
import { useAuth } from '../../../auth/useAuth';
import { useToast } from '../../../hooks/useToast';

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
    setOpenModal((prev) => !prev);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, key: string) => {
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
  return (
    <div>
      <button
        onClick={handleCustomStepModal}
        className='p-1.5 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors cursor-pointer'
      >
        <Plus className='h-4 w-4' />
      </button>
      <Modal isOpen={openModal} onClose={handleCustomStepModal}>
        <div>
          <div className='mb-4 text-center'>
            <h3 className='text-xl font-semibold flex items-center justify-center'>
              <NotebookPen className='mr-3' /> {editStep?.edit ? 'Update' : 'Add'} Custom Step
            </h3>
          </div>
          <div className='border-t border-gray-200'></div>
          <div className='pt-2'>
            <label className='font-semibold text-sm'>Step name*</label>
            <br />
            <input
              value={formData?.name}
              onChange={(e) => handleInput(e, 'name')}
              type='text'
              className='mt-1 mb-3 block w-full pr-3 py-2 pl-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-white'
              placeholder='Enter step name'
            />
            <label className='font-semibold text-sm'>Prompt*</label>
            <br />
            <textarea
              //   type="text"
              value={formData?.prompt}
              rows={4}
              onChange={(e) => handleInput(e, 'prompt')}
              className='mt-1 block w-full pr-3 py-2 pl-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-white'
              placeholder='Enter prompt'
            />
          </div>
          <div className='w-full flex justify-center mt-3 space-x-2'>
            <button
              disabled={!validateFields}
              onClick={triggerAddCustomStep}
              className='border rounded-lg px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer disabled:cursor-not-allowed'
            >
              {editStep?.edit ? 'Update' : 'Add'}
            </button>
            <button className='border rounded-lg px-6 py-2 hover:bg-gray-100 cursor-pointer' onClick={handleCustomStepModal}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
