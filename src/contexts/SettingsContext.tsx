import React, { useMemo, type FC } from 'react';
import { useApiQuery } from '../utils/customHooks/apiHooks';
import { useGetLoggedInUserSettingsRequestQuery } from '../utils/services/genericService';
import { useAuth } from '../auth/useAuth';

// interface SettingsContextType {
//   settings: any;
// }

export const SettingsContext = React.createContext<any>(null);

export const SettingsProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = React.useState<any>({});

  const { data: userSettings, refetchApi } = useApiQuery(
    useGetLoggedInUserSettingsRequestQuery,
    `/settings/getUserSettings?userId=${user?.id}`,
    {
      skipQuery: !Boolean(user?.id),
    },
  );

  React.useEffect(() => {
    if (userSettings?.settings) {
      setSettings((prev: any) => ({ ...prev, ...userSettings?.settings }));
    }
  }, [userSettings]);

  const refetchSettings = () => refetchApi();

  const isUnlimited = useMemo(() => {
    return settings?.isUnlimited || false;
  }, [settings]);

  const isWorkflowLimitReached = useMemo(() => {
    return isUnlimited ? false : settings?.workflowCreationLimit && settings?.workflowCreationUsage >= settings?.workflowCreationLimit;
  }, [settings, isUnlimited]);

  const isInviteLimitReached = useMemo(() => {
    return isUnlimited ? false : settings?.userInviteLimit && settings?.workflowCreationUsage >= settings?.userInviteLimit;
  }, [settings, isUnlimited]);

  const isExecutionLimitReached = useMemo(() => {
    return isUnlimited ? false : settings?.executionLimit && settings?.executionUsage >= settings?.executionLimit;
  }, [settings, isUnlimited]);

  const isLiveRoomLimitReached = useMemo(() => {
    return isUnlimited ? false : settings?.liveRoomLimit && settings?.liveRoomUsage >= settings?.liveRoomLimit;
  }, [settings, isUnlimited]);

  const handleSettings = (settings: any) => {
    setSettings(settings);
  };
  const settingsConfig = {
    ...settings,
    handleSettings,
    refetchSettings,
    isWorkflowLimitReached,
    isInviteLimitReached,
    isExecutionLimitReached,
    isLiveRoomLimitReached,
  };
  return <SettingsContext.Provider value={settingsConfig}>{children}</SettingsContext.Provider>;
};
