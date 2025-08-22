import React from "react";
import { Outlet } from "react-router";
import { useGetAuthRequestQuery } from "../services/authService";
import { useApiQuery } from "../customHooks/apiHooks";
// import { useAppSelector } from "../../store/hooks";

export const PrivateRoute: React.FC = () => {
  // const { accessToken } = useAppSelector((state) => state.auth);
  // console.log("token", accessToken);
  // const get = useApiQuery(useGetAuthRequestQuery, "/user");
  // console.log("fetching test", get);
  return <Outlet />;
};
