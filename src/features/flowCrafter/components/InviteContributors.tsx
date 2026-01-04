import { useMemo, useState, type FC } from 'react';
import { useParams } from 'react-router';
import { UserPlus, Send, Users, Mail, Eye, Edit, X, Check, Clock } from 'lucide-react';
import { Drawer } from '../../../utils/helperComponents/Drawer';
import { useApiMutation, useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useGetContributorsRequestQuery, usePostContributorsRequestMutation } from '../../../utils/services/genericService';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../auth/useAuth';
import { decodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';

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

  // const roleConfig = [
  //   { label: 'Viewer', value: 'viewer' },
  //   { label: 'Editor', value: 'editor' },
  // ];
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
  return (
    <div>
      <button
        onClick={handleDrawerOpen}
        className='flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
      >
        <UserPlus className='w-4 h-4' />
        <span className='text-sm font-medium'>Invite</span>
      </button>

      <Drawer title='Invite Contributors' titleIcon={UserPlus} isOpen={open} onClose={() => setOpen(false)} size={'w-150'}>
        <div className='h-full flex flex-col'>
          {/* Header */}
          {/* <div className='border-b border-slate-200 flex mb-2 items-center'>
            <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4'>
              <Users className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-slate-800'>Invite Contributors</h2>
              <p className='text-slate-500'>Collaborate with your team on this workflow</p>
            </div>
          </div> */}

          {/* Invite Form */}
          <div className='bg-gradient-to-r from-blue-50 to-purple-50 dark:from-dark-800 dark:to-dark-800 border border-transparent dark:border-dark-700 rounded-xl p-6 mb-6'>
            <h3 className='text-lg font-semibold text-slate-800 dark:text-dark-100 mb-4 flex items-center'>
              <Mail className='w-5 h-5 text-blue-600 dark:text-blue-400 mr-2' />
              Send Invitation
            </h3>

            <div className='space-y-4'>
              {/* Email Input */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-700 dark:text-dark-300 flex items-center'>
                  <span className='w-2 h-2 bg-blue-500 rounded-full mr-2'></span>
                  Email Address
                </label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-dark-400' />
                  <input
                    type='email'
                    value={contributorDetails.email || ''}
                    onChange={(e) => handleContributorDetails(e.target.value, 'email')}
                    placeholder='colleague@company.com'
                    className='w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-dark-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 placeholder-slate-400 dark:placeholder-dark-500 bg-white dark:bg-dark-900 text-slate-900 dark:text-dark-100'
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-slate-700 dark:text-dark-300 flex items-center'>
                  <span className='w-2 h-2 bg-purple-500 rounded-full mr-2'></span>
                  Permission Level
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  <button
                    onClick={() => handleContributorDetails('viewer', 'role')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      contributorDetails.role === 'viewer'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-slate-600 dark:text-dark-300 hover:border-slate-300 dark:hover:border-dark-600'
                    }`}
                  >
                    <div className='flex items-center space-x-2 mb-2'>
                      <Eye className='w-4 h-4' />
                      <span className='font-medium'>Viewer</span>
                    </div>
                    <p className='text-xs text-slate-500'>Can view and comment</p>
                  </button>

                  <button
                    onClick={() => handleContributorDetails('editor', 'role')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      contributorDetails.role === 'editor'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                        : 'border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900 text-slate-600 dark:text-dark-300 hover:border-slate-300 dark:hover:border-dark-600'
                    }`}
                  >
                    <div className='flex items-center space-x-2 mb-2'>
                      <Edit className='w-4 h-4' />
                      <span className='font-medium'>Editor</span>
                    </div>
                    <p className='text-xs text-slate-500 dark:text-dark-400'>Can edit and modify</p>
                  </button>
                </div>
              </div>

              {/* Send Button */}
              <div className='pt-4'>
                <button
                  onClick={sendInvite}
                  disabled={!isInviteValid}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    !isInviteValid
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                  }`}
                >
                  <div className='flex items-center justify-center space-x-2'>
                    <Send className='w-4 h-4' />
                    <span>Send Invitation</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Contributors List */}
          <div className='flex-1'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-semibold text-slate-800 dark:text-dark-100 flex items-center'>
                <Users className='w-5 h-5 text-slate-600 dark:text-dark-400 mr-2' />
                Team Members
                <span className='ml-2 text-sm bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-dark-300 px-2 py-1 rounded-full'>
                  {contributors.length}
                </span>
              </h3>
            </div>

            <div className='space-y-3 max-h-64 overflow-y-auto'>
              {getContibutors?.isLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                </div>
              ) : contributors.length === 0 ? (
                <div className='text-center py-8'>
                  <Users className='w-12 h-12 text-slate-300 mx-auto mb-3' />
                  <p className='text-slate-500'>No contributors yet</p>
                  <p className='text-sm text-slate-400'>Invite team members to get started</p>
                </div>
              ) : (
                contributors.map((contributor: any, index: number) => (
                  <div
                    key={index}
                    className='bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-xl p-4 hover:shadow-md transition-all duration-200'
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium'>
                          {(contributor?.inviteeEmail || contributor?.email)?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className='font-medium text-slate-800 dark:text-dark-100'>{contributor?.email || contributor?.inviteeEmail}</p>
                          <div className='flex items-center space-x-2'>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                contributor.role === 'editor'
                                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                              }`}
                            >
                              {contributor.role === 'editor' ? (
                                <>
                                  <Edit className='w-3 h-3 inline mr-1' />
                                  Editor
                                </>
                              ) : (
                                <>
                                  <Eye className='w-3 h-3 inline mr-1' />
                                  Viewer
                                </>
                              )}
                            </span>
                            {contributor.status === 'pending' && (
                              <span className='text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                Pending
                              </span>
                            )}
                            {contributor.status === 'accepted' && (
                              <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center'>
                                <Check className='w-3 h-3 mr-1' />
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className='p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors'>
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default InviteContributors;
