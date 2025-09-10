import { FlowCrafter } from '../features/flowCrafter/pages/FlowCrafter';
import { Workflows } from '../features/workflows/pages/Workflows';
import { PrivateRoute } from '../utils/routeGuard/PrivateRoute';

export const appRoutes = {
  path: 'workflows',
  element: <PrivateRoute />,
  children: [
    {
      index: true,
      element: <Workflows />,
    },
    {
      path: ':encodedParams',
      element: <FlowCrafter />,
    },
  ],
};
