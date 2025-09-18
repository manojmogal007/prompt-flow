import _ from 'lodash';
import { useAuth } from '../../../auth/useAuth';
import { useApiMutation, useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useGetStepsRequestQuery, usePostStepsRequestMutation } from '../../../utils/services/genericService';
import { LaptopMinimal, NotebookPen, Trash2, Sparkles, SquarePen } from 'lucide-react';
import { AddCustomStep } from './AddCustomStep';
import { useToast } from '../../../hooks/useToast';
import { Tooltip } from '../../../utils/helperComponents/Tooltip';
import { useParams } from 'react-router';
import { decodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import { useState } from 'react';

type NodeType = 'genericNode';

interface PromptStepProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType, step: any) => void;
  isOwner: boolean;
}

export const PromptSteps: React.FC<PromptStepProps> = ({ onDragStart, isOwner }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { encodedParams } = useParams();
  const { id: workflowId } = decodeNameAndId(encodedParams || '');
  const [editStep, setEditstep] = useState<any>({});

  const getPromptSteps = useApiQuery(
    useGetStepsRequestQuery,
    `/steps/getSteps?userId=${user.id}&${encodedParams !== 'new' ? `workflowId=${workflowId}` : ''}`,
    {
      skipQuery: !Boolean(user.id && encodedParams),
    },
  );

  const { handleTrigger } = useApiMutation(usePostStepsRequestMutation, '/steps/deleteStep', {
    onSuccess: () => {
      showToast('Step added successfully', 'success');
    },
    onError: () => {
      showToast('Something went wrong', 'error');
    },
  });
  const systemSteps = {
    label: 'System Steps',
    steps: _.groupBy(getPromptSteps?.data?.systemSteps || [], (s: any) => s.category),
  };
  const customSteps = {
    label: 'Custom Steps',
    steps: getPromptSteps?.data?.customSteps || [],
  };

  const triggerDeleteStep = async (stepId: any) => {
    await handleTrigger({ stepId });
  };

  const handleEdit = (step: any) => {
    setEditstep({ ...step, edit: true });
  };
  // console.log(editStep);
  return (
    <div className='p-2 pl-3 bg-white border-r border-gray-200 h-dvh overflow-y-auto'>
      {/* Header */}
      <div className='mb-2'>
        <p className='text-sm text-gray-600'>Drag and drop components to build your flow</p>
      </div>

      {/* System Steps Section */}
      <div className='mb-8'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-blue-700 flex items-center'>
            <LaptopMinimal className='mr-2 h-5 w-5' />
            System Steps
          </h2>
          {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {Object.values(systemSteps.steps).flat().length} steps
          </span> */}
        </div>

        {Object.entries(systemSteps.steps)?.map(([category, steps]) => (
          <div key={category} className='mb-4'>
            <h3 className='text-sm font-medium text-gray-600 mb-3 px-2 py-1 bg-gray-50 rounded-md'>{category}</h3>
            <div className='space-y-2'>
              {(steps as any[]).map((step: any, stepIndex: number) => (
                <div
                  key={`${category}-${stepIndex}`}
                  className='group px-2 py-2 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-blue-300 hover:shadow-sm hover:bg-blue-50'
                  onDragStart={(event) => {
                    // console.log('PromptSteps: Drag start for system step:', step.name);
                    onDragStart(event, 'genericNode', step);
                  }}
                  draggable
                >
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-700 group-hover:text-blue-700'>{step.name}</span>
                    <div className='opacity-0 opacity-100 transition-opacity'>
                      <Tooltip text={`Prompt: ${step?.prompt}`} width={300}>
                        <Sparkles className='w-4 h-4 text-blue-700' />
                      </Tooltip>
                    </div>
                  </div>
                  {step.description && <p className='text-xs text-gray-500 mt-1 line-clamp-2'>{step.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Steps Section */}
      <div className='mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-green-700 flex items-center'>
            <NotebookPen className='mr-2 h-5 w-5' />
            Custom Steps
          </h2>
          {isOwner && <AddCustomStep editStep={editStep} setEditstep={setEditstep} />}
        </div>

        {customSteps?.steps?.length ? (
          <div className='space-y-2'>
            {customSteps.steps.map((step: any, index: number) => (
              <div
                key={`custom-${index}`}
                className='relative group px-2 py-2 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-green-300 hover:shadow-sm hover:bg-green-50'
                onDragStart={(event) => {
                  onDragStart(event, 'genericNode', step);
                }}
                draggable
              >
                {isOwner && (
                  <div className='absolute -top-2.5 right-2 border rounded border-gray-400 bg-white px-1 py-0.5 flex items-center opacity-0 group-hover:opacity-100'>
                    <div className='opacity-100 group-hover:opacity-100 transition-opacity border-r-1 border-indigo-500 mr-1 pr-1'>
                      <SquarePen className='w-3.5 h-3.5 text-grey-500 hover:cursor-pointer' onClick={() => handleEdit(step)} />
                    </div>
                    <div className='opacity-100 group-hover:opacity-100 transition-opacity'>
                      <Trash2 className='w-3.5 h-3.5 text-red-500 hover:cursor-pointer' onClick={() => triggerDeleteStep(step._id)} />
                    </div>
                  </div>
                )}
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium text-gray-700 group-hover:text-green-700'>{step.name}</span>
                  <div className='flex items-center space-x-2'>
                    {/* Trash2: only visible on hover */}
                    {/* <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Trash2 className='w-4 h-4 text-red-500 hover:cursor-pointer' onClick={() => triggerDeleteStep(step._id)} />
                    </div> */}

                    {/* Sparkles: always visible */}
                    <Tooltip text={`Prompt: ${step?.prompt}`} width={300}>
                      <Sparkles className='w-4 h-4 text-green-700' />
                    </Tooltip>
                  </div>
                </div>
                {step.description && <p className='text-xs text-gray-500 mt-1 line-clamp-2'>{step.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className='text-center py-2 px-4'>
            <div className='w-12 h-6 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center '>
              <NotebookPen className='h-6 w-6 text-gray-400' />
            </div>
            <p className='text-sm text-gray-500 mb-3'>No custom steps yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {/* <div className="pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
            Import
          </button>
          <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors">
            Export
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default PromptSteps;
