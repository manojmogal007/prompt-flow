import { FlowCrafter } from "../features/flowCrafter/pages/FlowCrafter";
import { PrivateRoute } from "../utils/routeGuard/PrivateRoute";

export const appRoutes = {
  path: "app",
  element: <PrivateRoute />,
  children: [
    {
      index: true,
      element: <FlowCrafter />,
    },
  ],
};
