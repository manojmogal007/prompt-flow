import { createBrowserRouter, Navigate } from "react-router";
import App from "../App";
import { authRoutes } from "./authRoutes";
import { appRoutes } from "./appRoutes";
import { SignIn } from "../auth/pages/SignIn";
import SignUp from "../auth/pages/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/prompt-flow" replace />,
  },
  {
    path: "/prompt-flow",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/prompt-flow/app" replace />,
      },
      appRoutes,
      {
        path: "auth/signin",
        element: <SignIn />,
      },
      {
        path: "auth/signup",
        element: <SignUp />,
      },
    ],
  },
]);
