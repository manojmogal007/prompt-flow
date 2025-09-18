import { useMemo, useState, type FC } from 'react';
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
import Select from '../../../utils/helperComponents/Select';

const InviteContributors: FC = () => {
  const { user } = useAuth();
  const { encodedParams } = useParams();
  const { id: workflowId, name } = decodeNameAndId(encodedParams || '');
  const { showToast } = useToast();
  const [open, setOpen] = useState<boolean>(false);
  const [contributorDetails, setContributorDetails] = useState<Record<string, any>>({ role: 'viewer' });

  const { handleTrigger } = useApiMutation(usePostContributorsRequestMutation, '/contributor/addContributor', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
      setContributorDetails({ role: 'viewer' });
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

  const roleConfig = [
    { label: 'Viewer', value: 'viewer' },
    { label: 'Editor', value: 'editor' },
  ];
  // console.log(contributorDetails);
  const isInviteValid = useMemo(() => {
    return contributorDetails?.email && contributorDetails?.role;
  }, [contributorDetails]);

  const sendInvite = async () => {
    const payload = {
      workflowId,
      email: contributorDetails.email,
      senderName: `${user?.firstName} ${user?.lastName || ''}`,
      workflowLink: window.location.href,
      workflowName: name,
      ownerId: user?.id,
      role: contributorDetails?.role,
    };
    if (contributorDetails.email === user?.email) return showToast('Sorry! You cannot send invite to yourself', 'error');
    await handleTrigger(payload);
  };
  console.log(contributorDetails);
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
            <div className='w-[150px]'>
              <Select value={contributorDetails.role} handleChange={handleContributorDetails} valKey='role' options={roleConfig} />
            </div>
            <div className='w-[50px]'>
              <IconButton Icon={Send} triggerClick={sendInvite} size='md' disabled={!isInviteValid} />
            </div>
          </div>
          <div className='mt-3'>
            <ContributorsTable contributors={contributors} isLoading={getContibutors?.isLoading} roleConfig={roleConfig} />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default InviteContributors;
