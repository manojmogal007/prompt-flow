import React from "react";
import { Outlet } from "react-router";

export const MainLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};
