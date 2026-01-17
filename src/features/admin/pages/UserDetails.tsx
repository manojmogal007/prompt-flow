import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Save, ArrowLeft, Loader2, RefreshCw, Shield, Zap, Workflow, Users, Crown, Podcast } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  useGetUserSettingsRequestQuery,
  useUpdateSettingsRequestMutation,
  useBlockUserRequestMutation,
} from '../../../utils/services/genericService';
import { useToast } from '../../../hooks/useToast';
import Button from '../../../utils/helperComponents/Button';
import { useApiMutation, useApiQuery } from '../../../utils/customHooks/apiHooks';
import { decodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import { useSettings } from '../../../hooks/useSettings';
import { Infobar } from '../../../utils/helperComponents/Infobar';
import { useAuth } from '../../../auth/useAuth';

const PLANS_CONFIG = {
  free: {
    // isAdmin: false,
    // isSuperAdmin: false,
    // isBlocked: false,
    // isUnlimited: false,
    isLiveRoomsEnabled: false,
    liveRoomLimit: 5,
    liveRoomUsage: 0,
    userInviteLimit: 5,
    userInviteUsage: 0,
    workflowCreationLimit: 2,
    workflowCreationUsage: 0,
    executionLimit: 3,
    executionUsage: 0,
    plan: 'free',
  },
  pro: {
    // isAdmin: false,
    // isSuperAdmin: false,
    // isBlocked: false,
    // isUnlimited: false,
    isLiveRoomsEnabled: true,
    liveRoomLimit: 20,
    liveRoomUsage: 0,
    userInviteLimit: 10,
    userInviteUsage: 0,
    workflowCreationLimit: 20,
    workflowCreationUsage: 0,
    executionLimit: 50,
    executionUsage: 0,
    plan: 'pro',
  },
  enterprise: {
    // isAdmin: false,
    // isSuperAdmin: false,
    // isBlocked: false,
    // isUnlimited: false,
    isLiveRoomsEnabled: true,
    liveRoomLimit: 100,
    liveRoomUsage: 0,
    userInviteLimit: 100,
    userInviteUsage: 0,
    workflowCreationLimit: 100,
    workflowCreationUsage: 0,
    executionLimit: 500,
    executionUsage: 0,
    plan: 'enterprise',
  },
};
type PlanKey = keyof typeof PLANS_CONFIG;

export const UserDetails: React.FC = () => {
  const { encodedParams } = useParams();
  const { id: userId } = decodeNameAndId(encodedParams || '');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isSuperAdmin, isAdmin } = useSettings();
  const {
    user: { id },
  } = useAuth();

  // API Hooks
  const { data, isLoading } = useApiQuery(useGetUserSettingsRequestQuery, `/settings/getUserSettings?userId=${userId}`);
  const { handleTrigger: updateSettings, isLoading: isUpdating } = useApiMutation(
    useUpdateSettingsRequestMutation,
    `/settings/updateSettings?userId=${userId}`,
    {
      onSuccess: (data: any) => {
        showToast(data?.message, 'success');
      },
      onError: (error: any) => {
        showToast(error?.data?.message, 'error');
      },
    },
  );
  const { handleTrigger: blockUser, isLoading: isBlocking } = useApiMutation(
    useBlockUserRequestMutation,
    `/settings/toggleAccess?userId=${userId}`,
    {
      onSuccess: (data: any) => {
        showToast(data?.message, 'success');
      },
      onError: (error: any) => {
        showToast(error?.data?.message, 'error');
      },
    },
  );

  // Local State
  const [formData, setFormData] = useState<any>(PLANS_CONFIG.free);

  // Hydrate form data
  useEffect(() => {
    if (data?.settings) {
      setFormData({
        ...data.settings,
      });
    }
  }, [data]);

  const user = data?.user;
  const settings = data?.settings;
  const isUserSuperAdmin = data?.settings?.isSuperAdmin || false;
  const isBlocked = data?.settings?.isBlocked || false;
  const disableEdit = isBlocked ? isBlocked : isSuperAdmin ? false : isAdmin && isUserSuperAdmin ? true : isAdmin ? false : false;
  const enableBlockFeature = isSuperAdmin && user?._id !== id;
  //   console.log(isBlocked);
  //   console.log(isSuperAdmin);
  //   console.log(isAdmin && isUserSuperAdmin, isAdmin, isUserSuperAdmin);
  //   console.log(disableEdit);

  const handleSave = async () => {
    if (isUpdating) return;
    await updateSettings({ ...formData });
  };

  const handleBlockToggle = async () => {
    const isBlocked = !settings?.isBlocked;
    await blockUser({ isBlocked });
  };

  const swithchPlan = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (!(value in PLANS_CONFIG)) return;

    const plan = value as PlanKey;

    if (plan === data?.settings?.plan) {
      setFormData({
        ...data?.settings,
      });
      return;
    }
    setFormData({
      ...PLANS_CONFIG[plan],
    });
  };

  //   const resetPlan = () => {
  //     setFormData({
  //       ...PLANS_CONFIG?.[data?.settings?.plan],
  //     });
  //   };

  const handleChanges = (value: any, key: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const featureConfig: any = [
    {
      title: 'Super Admin Access',
      description:
        'By giving super admin access, user will have access to all features. Including editing and deleting all users and admin settings',
      value: formData?.isSuperAdmin,
      key: 'isSuperAdmin',
      disabled: disableEdit,
      icon: Crown,
      colors: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        toggle: 'bg-red-500',
      },
      adminAccess: false,
    },
    {
      title: 'Admin Access',
      description: 'Give access to create, update and delete all users',
      value: formData?.isAdmin,
      key: 'isAdmin',
      disabled: disableEdit,
      icon: Shield,
      colors: {
        bg: 'bg-violet-100 dark:bg-violet-900/30',
        text: 'text-violet-600 dark:text-violet-400',
        toggle: 'bg-violet-500',
      },
      adminAccess: false,
    },
    {
      title: 'Enable Unlimited Plan',
      description: 'Unlimited access to all features.',
      value: formData?.isUnlimited,
      key: 'isUnlimited',
      disabled: disableEdit,
      icon: Zap,
      colors: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-600 dark:text-amber-400',
        toggle: 'bg-amber-500',
      },
      adminAccess: false,
    },
    {
      title: 'Enable Live Rooms',
      description: 'Allow users to create and join live rooms.',
      value: formData?.isLiveRoomsEnabled,
      key: 'isLiveRoomsEnabled',
      disabled: disableEdit,
      icon: Podcast,
      colors: {
        bg: 'bg-rose-100 dark:bg-rose-900/30',
        text: 'text-rose-600 dark:text-rose-400',
        toggle: 'bg-rose-500',
      },
      adminAccess: true,
    },
  ];

  const accessibleFeatures = isSuperAdmin ? featureConfig : featureConfig.filter((feature: any) => feature.adminAccess) || [];
  console.log(user?._id, id);
  if (isLoading)
    return (
      <div className='h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin text-blue-500' size={40} />
      </div>
    );

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-dark-900 p-6 lg:p-10'>
      <div className='mx-auto flex justify-between items-center mb-5'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors'
        >
          <ArrowLeft size={18} /> <span className='font-medium'>Back to Users</span>
        </button>
        <div className='flex gap-3'>
          <Button label={isUpdating ? 'Saving...' : 'Save Changes'} icon={Save} triggerClick={handleSave} disabled={isUpdating} />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='mx-auto grid grid-cols-12 gap-8'>
        {/* Left Column: User Profile & Quick Actions */}
        <div className='col-span-12 lg:col-span-4 space-y-6'>
          <div className='bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 shadow-sm relative overflow-hidden'>
            <div
              className={`absolute top-0 left-0 w-full h-24 ${
                settings?.isBlocked ? 'bg-red-500/10' : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10'
              }`}
            ></div>
            <div className='relative flex flex-col items-center text-center mt-6'>
              <div className='w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl mb-4 border-4 border-white dark:border-dark-800'>
                {user?.firstName?.[0]}
              </div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {user?.firstName} {user?.lastName}
              </h1>
              <p className='text-gray-500 dark:text-gray-400'>{user?.email}</p>

              <div className='mt-6 w-full'>
                <label className='block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left'>Current Plan</label>
                <select
                  disabled={disableEdit}
                  value={formData?.plan}
                  onChange={swithchPlan}
                  className='w-full p-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-900/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium'
                >
                  <option value='free'>Free Tier</option>
                  <option value='pro'>Pro Plan</option>
                  <option value='enterprise'>Enterprise</option>
                </select>
              </div>

              {enableBlockFeature && (
                <button
                  onClick={handleBlockToggle}
                  disabled={isBlocking}
                  className={`cursor-pointer w-full mt-4 py-3 rounded-xl font-medium text-sm transition-colors border flex items-center justify-center gap-2 ${
                    settings?.isBlocked
                      ? 'bg-white border-green-300 text-green-700 hover:bg-green-100'
                      : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <Shield size={16} />
                  {settings?.isBlocked ? 'Unblock User Access' : 'Block User Access'}
                </button>
              )}
            </div>
          </div>

          {/* Stats Summary */}
          <div className='bg-white dark:bg-dark-800 rounded-2xl p-6 border border-gray-100 dark:border-dark-700 shadow-sm'>
            <h3 className='text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider'>Usage Overview</h3>
            <div className='space-y-6'>
              <UsageBar
                label='Workflows'
                icon={Workflow}
                used={settings?.workflowCreationUsage || 0}
                limit={settings?.workflowCreationLimit}
                color='bg-blue-500'
              />
              <UsageBar
                label='Executions'
                icon={Zap}
                used={settings?.executionUsage || 0}
                limit={settings?.executionLimit}
                color='bg-purple-500'
              />
              <UsageBar
                label='Team Members'
                icon={Users}
                used={settings?.userInviteUsage || 0}
                limit={settings?.userInviteLimit}
                color='bg-amber-500'
              />
              <UsageBar
                label='Live Rooms'
                icon={Podcast}
                used={settings?.liveRoomUsage || 0}
                limit={settings?.liveRoomLimit}
                color='bg-teal-500'
              />
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Settings Form */}
        <div className='col-span-12 lg:col-span-8'>
          <div className='bg-white dark:bg-dark-800 rounded-2xl p-8 border border-gray-100 dark:border-dark-700 shadow-sm h-full'>
            <div className='flex items-center gap-2 mb-4 pb-4 border-b border-gray-100 dark:border-dark-700'>
              <RefreshCw size={24} className='text-blue-500' />
              <div>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>Resource Limits & Configuration</h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Manually override system limits for this user.</p>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {/* Feature Toggles Section */}
              <div className='col-span-full mb-2'>
                {isBlocked || isUserSuperAdmin ? (
                  <Infobar
                    title={'Edit Access Restricted'}
                    type={'info'}
                    description={
                      isBlocked
                        ? 'You can’t edit access while the user is blocked.'
                        : isUserSuperAdmin
                        ? 'You can’t edit access for a super admin because you only have admin privileges.'
                        : ''
                    }
                  />
                ) : null}
              </div>
              <div className='col-span-full '>
                <label className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>Feature Access</label>
                {accessibleFeatures.map((feature: any) => (
                  <div className='p-4 rounded-xl bg-gray-50 dark:bg-dark-900/50 border border-gray-100 dark:border-dark-700 flex items-center justify-between mb-3'>
                    <div className='flex items-center gap-3'>
                      <div className={`p-2 rounded-lg ${feature.colors.bg} ${feature.colors.text}`}>
                        <feature.icon size={20} />
                      </div>
                      <div>
                        <label className='block text-sm font-semibold text-gray-900 dark:text-white'>{feature.title}</label>
                        <p className='text-xs text-gray-500 dark:text-gray-400'> {feature.description} </p>
                      </div>
                    </div>
                    <button
                      disabled={feature.disabled}
                      onClick={() => handleChanges(!formData?.[feature.key], feature.key)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
                        formData?.[feature.key] ? feature.colors.toggle : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                          formData?.[feature.key] ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className='col-span-full h-px bg-gray-100 dark:bg-dark-700 my-2'></div>

              {/* Limits Inputs */}
              <div className='col-span-full'>
                <label className='block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4'>Quantitative Limits</label>
              </div>

              <InputGroup
                disabled={disableEdit}
                label='Max Workflows'
                value={formData?.workflowCreationLimit}
                onChange={(val: any) => setFormData({ ...formData, workflowCreationLimit: parseInt(val) })}
                usage={formData?.workflowCreationUsage}
              />

              <InputGroup
                disabled={disableEdit}
                label='Execution Limit'
                value={formData?.executionLimit}
                onChange={(val: any) => setFormData({ ...formData, executionLimit: parseInt(val) })}
                usage={formData?.executionUsage}
              />

              <InputGroup
                disabled={disableEdit}
                label='Live Rooms Cap'
                value={formData?.liveRoomLimit}
                onChange={(val: any) => setFormData({ ...formData, liveRoomLimit: parseInt(val) })}
                usage={formData?.liveRoomUsage}
              />

              <InputGroup
                disabled={disableEdit}
                label='User Invites'
                value={formData?.userInviteLimit}
                onChange={(val: any) => setFormData({ ...formData, userInviteLimit: parseInt(val) })}
                usage={formData?.userInviteUsage}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const InputGroup = ({ label, value, onChange, usage, disabled }: any) => (
  <div>
    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>{label}</label>
    <input
      disabled={disabled}
      type='number'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className='w-full p-3 rounded-xl border border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium'
    />
    {usage >= 0 && <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>Used: {usage}</p>}
  </div>
);

const UsageBar = ({ label, icon: Icon, used, limit, color }: any) => (
  <div>
    <div className='flex justify-between text-xs mb-1.5'>
      <span className='text-gray-600 dark:text-gray-300 flex items-center gap-1.5 font-medium'>
        <Icon size={14} className='text-gray-400' /> {label}
      </span>
      <span className='text-gray-900 dark:text-white font-semibold'>
        {used} <span className='text-gray-400 font-normal'>/ {limit}</span>
      </span>
    </div>
    <div className='h-2 w-full bg-gray-100 dark:bg-dark-900 rounded-full overflow-hidden'>
      <div
        className={`h-full ${color} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min((used / Math.max(limit, 1)) * 100, 100)}%` }}
      />
    </div>
  </div>
);
