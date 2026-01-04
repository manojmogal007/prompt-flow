import React, { useRef, useCallback, useState, useEffect } from 'react';
import { addEdge, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDnD } from '../context/DnDContext';
import { GenericNode } from '../components/nodes/GenericNode';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router';
import { useGetWorkflowRequestQuery } from '../../../utils/services/genericService';
import { useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useAuth } from '../../../auth/useAuth';
import { decodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
  useStorage,
  useMutation,
  useMyPresence,
  useOthers,
  useBroadcastEvent,
} from '@liveblocks/react/suspense';
import { LIVEBLOCK_API_KEY } from '../../../config';
import { LiveList, LiveObject } from '@liveblocks/client';
import Loader from '../../../utils/helperComponents/Loader';
import { useToast } from '../../../hooks/useToast';
import InputTaker from '../components/nodes/InputTaker';
import OutputNode from '../components/nodes/OutputNode';
import DecisionNode from '../components/nodes/DecisionNode';
import DataProcessingNode from '../components/nodes/DataProcessingNode';
import ModernSidebar from '../components/ModernSidebar';
import ModernHeader from '../components/ModernHeader';
import { ModernCanvas } from '../components/ModernCanvas';
import { TestModal } from '../components/TestModal';

const inputNode = {
  id: 'cb02b245-7d6c-4925-96f2-c30328d972ba',
  type: 'inputNode',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    _id: '68a1e306b2cb2d799ad378a4',
    name: 'Text Input',
    prompt: 'Summarize the following customer review into 2–3 sentences.',
    type: 'system',
    category: 'Summarization',
    __v: 0,
  },
  measured: {
    width: 400,
    height: 112,
  },
};

// Collaborative FlowCrafter Component
const CollaborativeFlowCrafter: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { encodedParams } = useParams();
  const { id: workflowId } = decodeNameAndId(encodedParams || '');
  // const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const lastWarningRef = useRef<number>(0);

  // Liveblocks hooks
  const nodes = useStorage((root) => root.nodes);
  const edges = useStorage((root) => root.edges);
  const formData: any = useStorage((root) => root.formData);
  const [myPresence, updateMyPresence] = useMyPresence();
  const others = useOthers();

  // Debug logging
  console.log('user', user);
  console.log('🏛️ Room ID:', workflowId || 'new-workflow');
  console.log('🔍 My presence:', myPresence);
  console.log(
    '🔍 Others:',
    others.map((o) => ({ id: o.connectionId, cursor: o.presence?.cursor })),
  );
  // console.log('Collaborators:', others);
  // console.log('Number of collaborators:', others.length);
  // console.log(
  //   'Collaborator details:',
  //   others.map((other) => ({
  //     id: other.id,
  //     info: other.info,
  //     presence: other.presence,
  //   })),
  // );
  const broadcast = useBroadcastEvent();

  // Local ReactFlow state (will sync with Liveblocks)
  const [localNodes, setLocalNodes, onNodesChange] = useNodesState([inputNode]);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState([]);
  const [localFormData, setLocalFormData] = useState<Record<string, string>>({});
  // console.log('node', nodes);
  const { screenToFlowPosition } = useReactFlow();
  const [type, setType] = useDnD();
  const [draggingStepData, setDraggingStepData] = useState<any>(null);
  // Mutations for updating Liveblocks storage
  const updateNodes = useMutation(({ storage }, newNodes) => {
    storage.set('nodes', new LiveList(newNodes));
  }, []);

  const updateEdges = useMutation(({ storage }, newEdges) => {
    storage.set('edges', new LiveList(newEdges));
  }, []);

  const updateFormData = useMutation(({ storage }, newFormData) => {
    storage.set('formData', new LiveObject(newFormData));
  }, []);

  // Sync Liveblocks storage to local state
  useEffect(() => {
    if (nodes && Array.isArray(nodes)) {
      setLocalNodes(Array.from(nodes) as any);
    }
  }, [nodes]);

  useEffect(() => {
    if (edges && Array.isArray(edges)) {
      setLocalEdges(Array.from(edges) as any);
    }
  }, [edges]);

  useEffect(() => {
    if (formData && typeof formData === 'object') {
      setLocalFormData({
        name: (formData as any).name || '',
        description: (formData as any).description || '',
      });
    }
  }, [formData]);

  // API data loading
  const workflow = useApiQuery(useGetWorkflowRequestQuery, `/workflow/getWorkflowById?workflowId=${workflowId}&userId=${user?.id}`, {
    skipQuery: !Boolean(user?.id && encodedParams !== 'new'),
  });
  const userRole = workflow?.data?.userRole || '';
  const restrictEditing = userRole === 'viewer' || false;
  const isOwner = userRole === 'owner' || false;
  const workflowCreatorId = workflow?.data?.workflow?.workflowJson?.creatorId || '';

  // Initialize storage from API data
  useEffect(() => {
    const dbStoredJson = {
      name: workflow?.data?.workflow?.name,
      description: workflow?.data?.workflow?.description,
      nodes: workflow?.data?.workflow?.workflowJson?.nodes,
      edges: workflow?.data?.workflow?.workflowJson?.edges,
    };
    const liveJson = {
      name: formData?.name,
      description: formData?.description,
      nodes,
      edges,
    };
    // console.log(JSON.stringify(dbStoredJson) !== JSON.stringify(liveJson), others?.length);
    if (JSON.stringify(dbStoredJson) !== JSON.stringify(liveJson) && workflow?.data?.workflow?.workflowJson && others?.length === 0) {
      const nodesData = workflow?.data?.workflow?.workflowJson?.nodes || [];
      const edgesData = workflow?.data?.workflow?.workflowJson?.edges || [];
      updateNodes(JSON.parse(JSON.stringify(nodesData)));
      updateEdges(JSON.parse(JSON.stringify(edgesData)));
      updateFormData({
        name: workflow?.data?.workflow?.name || '',
        description: workflow?.data?.workflow?.description || '',
      });
    } else if (!dbStoredJson?.nodes?.length && !dbStoredJson?.edges?.length && others?.length === 0) {
      updateFormData({
        name: workflow?.data?.workflow?.name || '',
        description: workflow?.data?.workflow?.description || '',
      });
      // updateNodes(inputNode);
    }
    // if (
    //   workflow?.data?.workflow &&
    //   Array.isArray(workflow?.data?.workflow?.workflowJson?.nodes) &&
    //   (workflow?.data?.workflow?.workflowJson?.nodes as any[]).length === 0
    // ) {
    //   const nodesData = workflow?.data?.workflow?.workflowJson?.nodes;
    //   const edgesData = workflow?.data?.workflow?.workflowJson?.edges;
    //   console.log('entered in update block');
    //   if (nodesData) {
    //     updateNodes(JSON.parse(JSON.stringify(nodesData)));
    //   }
    //   if (edgesData) {
    //     updateEdges(JSON.parse(JSON.stringify(edgesData)));
    //   }
    //   updateFormData({
    //     name: workflow?.data?.workflow?.name || '',
    //     description: workflow?.data?.workflow?.description || '',
    //   });
    // }
  }, [workflow?.data?.workflow]);

  useEffect(() => {
    if (encodedParams === 'new') {
      updateNodes([inputNode]);
    }
  }, [encodedParams]);

  // useEffect(() => {
  //   if (encodedParams === 'new') {
  //     updateNodes([]);
  //     updateEdges([]);
  //     updateFormData({
  //       name: '',
  //       description: '',
  //     });
  //   }
  // }, [encodedParams]);

  // Enhanced callbacks that sync to Liveblocksconst
  const triggerWarning = () => {
    const now = Date.now();
    if (now - lastWarningRef.current < 3000) {
      return;
    }
    lastWarningRef.current = now;
    showToast('You are not allowed to edit this workflow', 'warning');
  };

  const onConnect = useCallback(
    (params: any) => {
      if (restrictEditing) {
        triggerWarning();
        return;
      }

      const newEdges: any = addEdge(params, localEdges);
      setLocalEdges(newEdges);
      updateEdges(newEdges);
      broadcast({ type: 'EDGE_CREATED', edgeId: params.id });
    },
    [localEdges, updateEdges, broadcast, restrictEditing],
  );

  // Handle node changes (position, selection, etc.) and sync to Liveblocks
  const handleNodesChange = useCallback(
    (changes: any) => {
      if (restrictEditing) {
        triggerWarning();
        return;
      }
      // Apply changes to local state first
      onNodesChange(changes);

      // Check if there are position changes that need to be synced
      const hasPositionChanges = changes.some((change: any) => change.type === 'position');

      if (hasPositionChanges) {
        // Use setTimeout to debounce the updates and avoid conflicts
        setTimeout(() => {
          // Get the current local nodes (which have the updated positions)
          setLocalNodes((currentLocalNodes) => {
            // Update Liveblocks storage with the current local nodes
            updateNodes(currentLocalNodes);
            return currentLocalNodes;
          });
        }, 100);
      }
    },
    [onNodesChange, updateNodes, restrictEditing],
  );

  // Handle edge changes and sync to Liveblocks
  const handleEdgesChange = useCallback(
    (changes: any) => {
      if (restrictEditing) {
        triggerWarning();
        return;
      }
      // Apply changes to local state first
      onEdgesChange(changes);

      // Check if there are changes that need to be synced
      const hasChanges = changes.length > 0;

      if (hasChanges) {
        // Use setTimeout to debounce the updates and avoid conflicts
        setTimeout(() => {
          // Get the current local edges (which have the updated changes)
          setLocalEdges((currentLocalEdges) => {
            // Update Liveblocks storage with the current local edges
            updateEdges(currentLocalEdges);
            return currentLocalEdges;
          });
        }, 100);
      }
    },
    [onEdgesChange, updateEdges, restrictEditing],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (restrictEditing) {
      triggerWarning();
      return;
    }
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (restrictEditing) {
        triggerWarning();
        return;
      }
      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: any = {
        id: uuidv4(),
        type,
        position,
        data: { ...draggingStepData },
      };

      const newNodes: any = [...localNodes, newNode];
      setLocalNodes(newNodes);
      updateNodes(newNodes);
      setType(null);
    },
    [screenToFlowPosition, type, setType, draggingStepData, localNodes, updateNodes, restrictEditing],
  );

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, step: any) => {
    if (restrictEditing) {
      triggerWarning();
      return;
    }
    setDraggingStepData(step);
    setType(nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const removeStep = useCallback(
    (stepId: string) => {
      if (restrictEditing) {
        triggerWarning();
        return;
      }
      const newNodes = localNodes.filter((n: any) => n.id !== stepId);
      setLocalNodes(newNodes);
      updateNodes(newNodes);
      broadcast({ type: 'NODE_DELETED', nodeId: stepId });
    },
    [restrictEditing, localNodes, updateNodes, broadcast],
  );

  const handleFormDataChange = (newFormData: Record<string, string>) => {
    if (restrictEditing) {
      triggerWarning();
      return;
    }
    // console.log('newFormData', newFormData);
    setLocalFormData(newFormData);
    updateFormData(newFormData);
  };

  // Handle node selection for presence
  const handleNodeClick = (_event: React.MouseEvent, node: any) => {
    if (restrictEditing) {
      triggerWarning();
      return;
    }
    updateMyPresence({ selectedNodeId: node.id });
    broadcast({ type: 'NODE_SELECTED', nodeId: node.id });
  };

  const updateInputTakerNode = useCallback(
    (id: string, text: string) => {
      setLocalNodes((nds) => {
        const newNodes = nds.map((node) => {
          if (node.id === id) {
            return { ...node, data: { ...node.data, text } };
          }
          return node;
        });
        updateNodes(newNodes);
        return newNodes;
      });
    },
    [updateNodes],
  );

  // Create stable wrapper components to prevent re-creation and focus loss
  const InputTakerWrapper = useCallback(
    (props: any) => {
      return (
        <InputTaker
          {...props}
          data={props.data}
          onPromptChange={(text: string) => updateInputTakerNode(props.id, text)}
        />
      );
    },
    [updateInputTakerNode],
  );

  const GenericNodeWrapper = useCallback(
    (props: any) => {
      return <GenericNode {...props} data={props.data} removeStep={removeStep} edges={localEdges} />;
    },
    [removeStep, localEdges],
  );

  const OutputNodeWrapper = useCallback((props: any) => {
    return <OutputNode {...props} data={props.data} />;
  }, []);

  const DecisionNodeWrapper = useCallback((props: any) => {
    return <DecisionNode {...props} data={props.data} />;
  }, []);

  const DataProcessingNodeWrapper = useCallback((props: any) => {
    return <DataProcessingNode {...props} data={props.data} />;
  }, []);

  const nodeTypes: any = {
    inputNode: InputTakerWrapper,
    genericNode: GenericNodeWrapper,
    outputNode: OutputNodeWrapper,
    decisionNode: DecisionNodeWrapper,
    dataProcessingNode: DataProcessingNodeWrapper,
  };

  // Cursor tracking with throttling
  const lastCursorUpdate = useRef<number>(0);
  const handleCursorMove = (x: number, y: number) => {
    const now = Date.now();
    // Throttle to max 20 updates per second (every 50ms)
    if (now - lastCursorUpdate.current < 50) {
      return;
    }
    lastCursorUpdate.current = now;

    console.log('📡 Broadcasting cursor to Liveblocks:', { x, y });
    const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'Anonymous';
    updateMyPresence({
      cursor: { x, y },
      userName: userName,
    });
    console.log('✅ updateMyPresence called with userName:', userName);
  };

  const handlePointerLeave = useCallback(() => {
    console.log('🚪 Pointer left canvas - clearing cursor');
    updateMyPresence({ cursor: null });
  }, [updateMyPresence]);

  return (
    <div className='w-full h-screen bg-slate-50 dark:bg-dark-900 flex flex-col'>
      {/* Modern Header */}
      <ModernHeader
        nodes={localNodes}
        edges={localEdges}
        userRole={userRole}
        formData={localFormData}
        handleFormDataChange={handleFormDataChange}
        collaborators={others}
        workflowCreatorId={workflowCreatorId}
      />

      {/* Main Content Area */}
      <div className='flex-1 flex overflow-hidden'>
        {/* Modern Sidebar */}
        <div className='w-80 flex-shrink-0'>
          <ModernSidebar onDragStart={onDragStart} isOwner={isOwner} />
        </div>

        {/* Modern Canvas */}
        <div className='flex-1 relative'>
          <ModernCanvas
            nodes={localNodes}
            edges={localEdges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={handleNodeClick}
            onPointerMove={() => { }}
            onPointerLeave={handlePointerLeave}
            onCursorMove={handleCursorMove}
            nodeTypes={nodeTypes}
            collaborators={others}
          />
        </div>
      </div>

      {/* Test Modal for debugging */}
      {/* <TestModal /> */}
    </div>
  );
};

// Main FlowCrafter component with Liveblocks providers
export const FlowCrafter: React.FC = () => {
  const { encodedParams } = useParams();
  const { id: workflowId } = decodeNameAndId(encodedParams || '');

  const { user } = useAuth();

  return (
    <LiveblocksProvider
      publicApiKey={LIVEBLOCK_API_KEY}
      resolveUsers={async ({ userIds }) => {
        console.log('👥 Resolving users:', userIds, 'Current user:', user);
        // Return user info - in production, fetch from your API
        const resolved = userIds.map((userId) => {
          // If this is the current user, use their actual info
          if (user && userId === user.id) {
            const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email || 'You';
            return {
              id: userId,
              info: {
                name: fullName,
                email: user.email || '',
                role: 'collaborator',
              },
            };
          }
          // For other users, use generic name (in production, fetch from API)
          return {
            id: userId,
            info: {
              name: `User ${userId.slice(-4)}`,
              email: `${userId}@example.com`,
              role: 'collaborator',
            },
          };
        });
        console.log('👥 Resolved users:', resolved);
        return resolved;
      }}
    >
      <RoomProvider
        id={workflowId || 'new-workflow'}
        initialPresence={{
          cursor: null,
          selectedNodeId: null,
          isTyping: false,
          userName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || null,
        }}
        initialStorage={{
          nodes: new LiveList<any>([]),
          edges: new LiveList<any>([]),
          formData: new LiveObject({
            name: '',
            description: '',
          }),
        }}
      >
        <ClientSideSuspense
          fallback={
            <div className='min-h-screen flex items-center justify-center'>
              <div className='flex flex-col items-center gap-2'>
                <Loader />
                <p>Loading workflow...</p>
              </div>
            </div>
          }
        >
          <CollaborativeFlowCrafter />
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};
