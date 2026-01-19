import { useParams } from 'react-router';
import { FlowCrafter } from './FlowCrafter';
import { LocalFlowCrafter } from './LocalFlowCrafter';
import LiveRoomGuard from '../components/LiveRoomGuard';

function RootCrafter() {
  const { method } = useParams();
  if (method === 'local') return <LocalFlowCrafter />;
  return (
    <LiveRoomGuard>
      <FlowCrafter />
    </LiveRoomGuard>
  );
}

export default RootCrafter;
