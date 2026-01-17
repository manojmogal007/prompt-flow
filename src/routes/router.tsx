import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import { authRoutes } from "./authRoutes";
import { appRoutes } from "./appRoutes";
import { adminRoutes } from "./adminRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/prompt-flow" replace />,
  },
  {
    path: "/prompt-flow",
    element: <App />,
    children: [
      authRoutes,
      {
        index: true,
        element: <Navigate to="/prompt-flow/workflows" replace />,
      },
      appRoutes,
      adminRoutes,
    ],
  },
]);
