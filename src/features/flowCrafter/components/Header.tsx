import React, { useMemo, useState } from 'react';
import { useApiMutation } from '../../../utils/customHooks/apiHooks';
import { usePostWorkflowsRequestMutation, useUpdateWorkflowsRequestMutation } from '../../../utils/services/genericService';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../auth/useAuth';
import InviteContributors from './InviteContributors';
import { useNavigate, useParams } from 'react-router';
import { decodeNameAndId, encodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import Button from '../../../utils/helperComponents/Button';
import { SaveAll, ArrowLeftFromLine, SquarePen } from 'lucide-react';
import { Modal } from '../../../utils/helperComponents/Modal';
import DetailsTaker from './DetailsTaker';

interface Props {
  nodes: any[];
  edges: any[];
  userRole: string;
  formData: any;
  setFormData: any;
}

export const Header: React.FC<Props> = ({ nodes, edges, userRole, formData, setFormData }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { encodedParams } = useParams();
  const { id: workflowId, name } = decodeNameAndId(encodedParams);
  const isNewWorkflow = encodedParams === 'new' || false;
  const [open, setOpen] = useState(false);
  const saveWorkflow = useApiMutation(usePostWorkflowsRequestMutation, '/workflow/createWorkflow', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
      navigate(`/prompt-flow/workflows/${encodeNameAndId(data?.workflow?.name, data?.workflow?._id)}`);
    },
    onError: () => {
      showToast('Something went wrong', 'error');
    },
  });
  const updateWorkflow = useApiMutation(useUpdateWorkflowsRequestMutation, '/workflow/updateWorkflow', {
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
    setFormData({});
    setOpen(false);
  };

  const triggerBack = () => {
    navigate(-1);
  };

  const handleChange = (val: string, key: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleSaveOrOpen = () => {
    if (isNewWorkflow) handleToggle();
    else triggerSaveWorkflow();
  };

  return (
    <div className='flex flex-row items-center justify-between py-2 px-3 space-x-2'>
      <Modal isOpen={open} onClose={handleToggle}>
        <div className='mb-4 text-center'>
          <h3 className='text-xl font-semibold flex items-center justify-center'>{isNewWorkflow ? 'Create' : 'Update'} workflow</h3>
        </div>
        <div className='border-t border-gray-200 mb-2'></div>
        <DetailsTaker
          handleClose={handleToggle}
          name={formData.name}
          description={formData.description}
          handleSave={triggerSaveWorkflow}
          handleChange={handleChange}
          validation={payloadValidation}
        />
      </Modal>
      <div className='flex flex-row items-center py-2 px-3 space-x-2'>
        <h3 className='text-[18px] font-semibold'>{formData.name || ''}</h3>
        {!isNewWorkflow && <SquarePen className='cursor-pointer text-blue-500 h-4 w-4' onClick={handleToggle} size={20} />}
      </div>
      <div className='flex flex-row items-center justify-end py-2 px-3 space-x-2'>
        <Button triggerClick={handleSaveOrOpen} label='Save' icon={SaveAll} size='md' color={'blue'} disabled={nodes.length === 0} />
        <Button triggerClick={triggerBack} label='Exit' icon={ArrowLeftFromLine} size='md' color={'red'} isHollow={true} />
        {userRole === 'owner' && <InviteContributors />}
      </div>
    </div>
  );
};

export default Header;
