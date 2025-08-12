import React from "react";
import { Outlet } from "react-router";

export const PrivateRoute: React.FC = () => {
  return <Outlet />;
};
