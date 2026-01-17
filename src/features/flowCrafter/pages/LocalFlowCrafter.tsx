import React, { useRef, useCallback, useState, useEffect } from 'react';
import { addEdge, useNodesState, useEdgesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router';

import { useDnD } from '../context/DnDContext';
import { GenericNode } from '../components/nodes/GenericNode';
import InputTaker from '../components/nodes/InputTaker';
import OutputNode from '../components/nodes/OutputNode';
import DecisionNode from '../components/nodes/DecisionNode';
import DataProcessingNode from '../components/nodes/DataProcessingNode';

import ModernSidebar from '../components/ModernSidebar';
import ModernHeader from '../components/ModernHeader';
import { ModernCanvas } from '../components/ModernCanvas';

import { useGetWorkflowRequestQuery } from '../../../utils/services/genericService';
import { useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useAuth } from '../../../auth/useAuth';
import { decodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import { useToast } from '../../../hooks/useToast';

/* -------------------- DEFAULT INPUT NODE -------------------- */

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

/* -------------------- MAIN COMPONENT -------------------- */

const CollaborativeFlowCrafter: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { encodedParams } = useParams();
  const { id: workflowId } = decodeNameAndId(encodedParams || '');

  const lastWarningRef = useRef<number>(0);

  /* -------------------- LOCAL STATE -------------------- */

  const [localNodes, setLocalNodes, onNodesChange] = useNodesState([inputNode]);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState<any>([]);
  const [localFormData, setLocalFormData] = useState({
    name: '',
    description: '',
  });

  console.log('localNodes', localNodes);

  const { screenToFlowPosition } = useReactFlow();
  const [type, setType] = useDnD();
  const [draggingStepData, setDraggingStepData] = useState<any>(null);

  /* -------------------- API LOAD -------------------- */

  const workflow = useApiQuery(useGetWorkflowRequestQuery, `/workflow/getWorkflowById?workflowId=${workflowId}&userId=${user?.id}`, {
    skipQuery: !Boolean(user?.id && encodedParams !== 'new'),
  });

  const userRole = workflow?.data?.userRole || '';
  const restrictEditing = userRole === 'viewer';
  const isOwner = userRole === 'owner';
  const workflowCreatorId = workflow?.data?.workflow?.workflowJson?.creatorId || '';

  /* -------------------- INIT FROM API -------------------- */

  useEffect(() => {
    if (!workflow?.data?.workflow) return;

    const wf = workflow.data.workflow || {};

    if (encodedParams === 'new') {
      setLocalNodes([inputNode]);
      setLocalEdges([]);
      setLocalFormData({ name: '', description: '' });
      return;
    }

    setLocalNodes(structuredClone(wf?.workflowJson?.nodes));
    setLocalEdges(wf?.workflowJson?.edges || []);

    setLocalFormData({
      name: wf.name || '',
      description: wf.description || '',
    });
  }, [workflow?.data?.workflow, encodedParams]);

  /* -------------------- HELPERS -------------------- */

  const triggerWarning = () => {
    const now = Date.now();
    if (now - lastWarningRef.current < 3000) return;
    lastWarningRef.current = now;
    showToast('You are not allowed to edit this workflow', 'warning');
  };

  /* -------------------- FLOW HANDLERS -------------------- */

  const onConnect = useCallback(
    (params: any) => {
      if (restrictEditing) return triggerWarning();
      setLocalEdges((eds) => addEdge(params, eds));
    },
    [restrictEditing],
  );

  const handleNodesChange = useCallback(
    (changes: any) => {
      if (restrictEditing) return triggerWarning();
      onNodesChange(changes);
    },
    [onNodesChange, restrictEditing],
  );

  const handleEdgesChange = useCallback(
    (changes: any) => {
      if (restrictEditing) return triggerWarning();
      onEdgesChange(changes);
    },
    [onEdgesChange, restrictEditing],
  );

  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (restrictEditing) return triggerWarning();
      event.dataTransfer.dropEffect = 'move';
    },
    [restrictEditing],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (restrictEditing || !type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { ...draggingStepData },
      };

      setLocalNodes((nds: any) => [...nds, newNode]);
      setType(null);
    },
    [screenToFlowPosition, type, draggingStepData, restrictEditing],
  );

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, step: any) => {
    if (restrictEditing) return triggerWarning();
    setDraggingStepData(step);
    setType(nodeType);
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const removeStep = useCallback(
    (stepId: string) => {
      if (restrictEditing) return triggerWarning();
      setLocalNodes((nds) => nds.filter((n) => n.id !== stepId));
    },
    [restrictEditing],
  );

  const handleFormDataChange = (data: { name: string; description: string }) => {
    if (restrictEditing) return triggerWarning();
    setLocalFormData(data);
  };

  /* -------------------- NODE UPDATES -------------------- */

  const updateInputTakerNode = useCallback((prompt: string) => {
    setLocalNodes((nds) => nds.map((node) => (node.type === 'inputNode' ? { ...node, data: { ...node.data, prompt } } : node)));
  }, []);

  /* -------------------- NODE WRAPPERS -------------------- */
  const InputTakerWrapper = useCallback(
    (props: any) => {
      return <InputTaker {...props} data={props.data} onPromptChange={updateInputTakerNode} />;
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
  console.log('workflowCreatorId', workflowCreatorId);
  return (
    <div className={`w-full bg-slate-50 dark:bg-dark-900 flex flex-col h-[calc(100vh-60px)]`}>
      <ModernHeader
        nodes={localNodes}
        edges={localEdges}
        userRole={userRole}
        formData={localFormData}
        handleFormDataChange={handleFormDataChange}
        collaborators={[]}
        // workflowCreatorId={workflowCreatorId}
      />

      <div className='flex-1 flex overflow-hidden'>
        <div className='w-80 flex-shrink-0'>
          <ModernSidebar onDragStart={onDragStart} isOwner={isOwner} />
        </div>

        <div className='flex-1 relative'>
          <ModernCanvas
            nodes={localNodes}
            edges={localEdges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            collaborators={[]}
          />
        </div>
      </div>
    </div>
  );
};

export const LocalFlowCrafter: React.FC = () => {
  // const { encodedParams } = useParams();
  // const { id: workflowId } = decodeNameAndId(encodedParams || '');
  // const { user } = useAuth();

  return <CollaborativeFlowCrafter />;
};
