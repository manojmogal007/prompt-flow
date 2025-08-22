import { SignIn } from "../auth/pages/SignIn";
import { SignUp } from "../auth/pages/SignUp";

export const authRoutes = {
  path: "auth",
  children: [
    {
      path: "signin",
      element: <SignIn />,
    },
    {
      path: "signup",
      element: <SignUp />,
    },
  ],
};
