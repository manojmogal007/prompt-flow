import React from 'react';
import { FlowCrafter } from '../features/flowCrafter/pages/FlowCrafter';
import { LocalFlowCrafter } from '../features/flowCrafter/pages/LocalFlowCrafter';
import { Workflows } from '../features/workflows/pages/Workflows';
import { PrivateRoute } from '../utils/routeGuard/PrivateRoute';
const RootCrafter = React.lazy(() => import('../features/flowCrafter/pages/RootCrafter'));

export const appRoutes = {
  path: 'workflows',
  element: <PrivateRoute />,
  children: [
    {
      index: true,
      element: <Workflows />,
    },
    {
      path: ':method/:encodedParams',
      // element: <FlowCrafter />,
      // element: <LocalFlowCrafter />,
      element: <RootCrafter />,
    },
  ],
};
