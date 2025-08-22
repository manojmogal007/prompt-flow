import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { useApiQuery } from "../utils/customHooks/apiHooks";
import { useGetAuthRequestQuery } from "../utils/services/authService";
import { useAuth } from "../auth/useAuth";
import { useAppSelector } from "../store/hooks";
import { accessTokenConfig } from "../auth/authSlice";

export const MainLayout: React.FC = () => {
  const accessToken = useAppSelector(accessTokenConfig);
  const { handleUser } = useAuth();
  const userDetails = useApiQuery(useGetAuthRequestQuery, "/users/getUser", {
    skipQuery: !Boolean(accessToken),
  });

  useEffect(() => {
    if(userDetails?.data?.user) handleUser(userDetails.data.user);
  },[userDetails.data]);
  
  return (
    <div className="min-h-screen flex bg-white dark:bg-dark-900">
      <Outlet />
    </div>
  );
};
