import React, { useState } from 'react';
import { useApiMutation } from '../utils/customHooks/apiHooks';
import { usePostAuthRequestMutation } from '../utils/services/authService';
import { useAppDispatch } from '../store/hooks';
// import { useNavigate } from 'react-router';
import { handleAccessToken } from './authSlice';

interface AuthContextType {
  user: any;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const [user, setUser] = useState<Record<string, any>>({});

  const { handleTrigger } = useApiMutation(usePostAuthRequestMutation, '/users/signout', {
    onSuccess: () => {
      dispatch(handleAccessToken(''));
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // const { handleTrigger: updateSettings, isLoading: isUpdating } = useApiMutation(
  //   useUpdateSettingsRequestMutation,
  //   `/settings/updateSettings?userId=${user?.id}`,
  // );

  const handleUser = (user: any) => setUser({ ...user, id: user._id });
  const logout = async () => {
    const res = await handleTrigger({});
    setUser({});
    return res;
  };

  const authConfig = { user, handleUser, logout };
  return <AuthContext.Provider value={authConfig}>{children}</AuthContext.Provider>;
};
