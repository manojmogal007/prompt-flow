import React, { use, useState, type FC } from 'react';
import { useParams } from 'react-router';
import { UserPlus, Send } from 'lucide-react';
import IconButton from '../../../utils/helperComponents/IconButton';
import { Drawer } from '../../../utils/helperComponents/Drawer';
import { Input } from '../../../utils/helperComponents/Input';
import { useApiMutation, useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useGetContributorsRequestQuery, usePostContributorsRequestMutation } from '../../../utils/services/genericService';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../auth/useAuth';
import ContributorsTable from './ContributorsTable';
import { decodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';

const InviteContributors: FC = () => {
  const { user } = useAuth();
  const { encodedParams } = useParams();
  const { id: workflowId, name } = decodeNameAndId(encodedParams || '');
  const { showToast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [contributorDetails, setContributorDetails] = useState<Record<string, any>>({});

  const { handleTrigger, isLoading } = useApiMutation(usePostContributorsRequestMutation, '/contributor/addContributor', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
      setContributorDetails({});
    },
    onError: (error: any) => {
      showToast(error?.data?.message, 'error');
    },
  });

  const getContibutors = useApiQuery(useGetContributorsRequestQuery, `/contributor/getContributors?workflowId=${workflowId}`, {});
  const contributors: any = [...(getContibutors?.data?.contributors ?? []), ...(getContibutors?.data?.invites ?? [])]?.filter(
    (contributor) => contributor?.role !== 'owner',
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleContributorDetails = (val: any, key: string) => {
    setContributorDetails((prev) => ({ ...prev, [key]: val }));
  };
  // console.log(contributorDetails);
  const sendInvite = async () => {
    const payload = {
      workflowId,
      email: contributorDetails.email,
      senderName: `${user?.firstName} ${user?.lastName || ''}`,
      workflowLink: window.location.href,
      workflowName: 'Formal email generator',
      ownerId: user?.id,
      role: 'viewer',
    };
    if (contributorDetails.email === user?.email) return showToast('Sorry! You cannot invite yourself', 'error');
    await handleTrigger(payload);
  };
  return (
    <div>
      <IconButton Icon={UserPlus} triggerClick={handleDrawerOpen} />
      <Drawer title='Invite Contributors' titleIcon={UserPlus} isOpen={open} onClose={() => setOpen(false)} size={'w-150'}>
        <div>
          <div className='flex items-center justify-between space-x-2'>
            <Input
              handleInputChange={handleContributorDetails}
              valKey='email'
              placeHolder='Enter email'
              type='email'
              value={contributorDetails.email}
              size={'sm'}
            />
            <IconButton Icon={Send} triggerClick={sendInvite} size='md' />
          </div>
          <div className='mt-3'>
            <ContributorsTable contributors={contributors} isLoading={getContibutors?.isLoading} />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default InviteContributors;
