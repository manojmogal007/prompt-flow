import React from 'react';
import { useParams } from 'react-router';
import { FlowCrafter } from './FlowCrafter';
import { LocalFlowCrafter } from './LocalFlowCrafter';

function RootCrafter() {
  const { method } = useParams();
//   if (method === 'local') return <LocalFlowCrafter />;
  return <FlowCrafter />;
}

export default RootCrafter;
