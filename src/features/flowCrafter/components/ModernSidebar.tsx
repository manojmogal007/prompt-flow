import React, { useState } from 'react';
import {
  LaptopMinimal,
  NotebookPen,
  Trash2,
  Sparkles,
  SquarePen,
  Plus,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  FileText,
  GitBranch,
  Database,
  Download,
  Settings,
  Zap,
  Play,
  Pause,
  BarChart3,
  LibraryBig,
  Cable,
} from 'lucide-react';
import { useAuth } from '../../../auth/useAuth';
import { useApiMutation, useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useGetStepsRequestQuery, usePostStepsRequestMutation } from '../../../utils/services/genericService';
import { AddCustomStep } from './AddCustomStep';
import { useToast } from '../../../hooks/useToast';
import { Tooltip } from '../../../utils/helperComponents/Tooltip';
import { useParams } from 'react-router';
import { decodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import _ from 'lodash';

type NodeType = 'genericNode' | 'inputNode' | 'outputNode' | 'decisionNode' | 'dataProcessingNode';

interface ModernSidebarProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: NodeType, step: any) => void;
  isOwner: boolean;
}

export const ModernSidebar: React.FC<ModernSidebarProps> = ({ onDragStart, isOwner }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { encodedParams } = useParams();
  const { id: workflowId } = decodeNameAndId(encodedParams || '');
  const [editStep, setEditstep] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSections, setExpandedSections] = useState({
    system: false,
    custom: true,
    actions: true,
  });

  const getPromptSteps = useApiQuery(
    useGetStepsRequestQuery,
    `/steps/getSteps?userId=${user.id}&${encodedParams !== 'new' ? `workflowId=${workflowId}` : ''}`,
    {
      skipQuery: !Boolean(user.id && encodedParams),
    },
  );

  const { handleTrigger } = useApiMutation(usePostStepsRequestMutation, '/steps/deleteStep', {
    onSuccess: () => {
      showToast('Step deleted successfully', 'success');
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

  // Template nodes for quick access
  const templateNodes = [
    {
      type: 'inputNode',
      name: 'Text Input',
      description: 'Start your workflow with target input',
      icon: FileText,
      color: 'emerald',
    },
    // {
    //   type: 'outputNode',
    //   name: 'Output',
    //   description: 'Display results to users',
    //   icon: Download,
    //   color: 'purple',
    // },
    // {
    //   type: 'decisionNode',
    //   name: 'Decision',
    //   description: 'Add conditional logic',
    //   icon: GitBranch,
    //   color: 'orange',
    // },
    // {
    //   type: 'dataProcessingNode',
    //   name: 'Data Processing',
    //   description: 'Transform and process data',
    //   icon: Database,
    //   color: 'indigo',
    // },
  ];

  const triggerDeleteStep = async (stepId: any) => {
    await handleTrigger({ stepId });
  };

  const handleEdit = (step: any) => {
    setEditstep({ ...step, edit: true });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filteredSystemSteps = Object.entries(systemSteps.steps).reduce((acc, [category, steps]) => {
    const filtered = (steps as any[]).filter(
      (step) => step.name.toLowerCase().includes(searchTerm.toLowerCase()) || step.prompt.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {} as any);

  const filteredCustomSteps = customSteps.steps.filter(
    (step) => step.name.toLowerCase().includes(searchTerm.toLowerCase()) || step.prompt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTemplates = templateNodes.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='h-full bg-gradient-to-b from-slate-50 to-white dark:from-dark-900 dark:to-dark-800 border-r border-slate-200 dark:border-dark-700 flex flex-col relative z-10'>
      {/* Header */}
      <div className='p-4 border-b border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-900'>
        <div className='flex items-center space-x-2 mb-4'>
          <div className='p-2 bg-blue-500 rounded-lg'>
            <LibraryBig className='w-5 h-5 text-white' />
          </div>
          <div>
            <h2 className='text-lg font-semibold text-slate-800 dark:text-dark-100'>Component Library</h2>
            <p className='text-sm text-slate-500 dark:text-dark-400'>Drag components to build your workflow</p>
          </div>
        </div>

        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400' />
          <input
            type='text'
            placeholder='Search components...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-white dark:bg-dark-800 dark:text-dark-100 shadow-sm'
          />
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 overflow-y-auto p-4 space-y-6'>
        {/* Template Nodes */}
        <div>
          <button onClick={() => toggleSection('actions')} className='flex items-center justify-between w-full text-left mb-3'>
            <div className='flex items-center space-x-2'>
              <div className='p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg'>
                <Cable className='w-4 h-4 text-white' />
              </div>
              <h3 className='font-semibold text-slate-700 dark:text-dark-200'>Actions</h3>
            </div>
            {expandedSections.actions ? (
              <ChevronDown className='w-4 h-4 text-slate-500' />
            ) : (
              <ChevronRight className='w-4 h-4 text-slate-500' />
            )}
          </button>

          {expandedSections.actions && (
            <div className='space-y-2'>
              {filteredTemplates.map((template, index) => {
                const IconComponent = template.icon;
                return (
                  <div
                    key={index}
                    className={`group p-3 border border-slate-200 dark:border-gray-700 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:border-${template.color}-300 hover:bg-${template.color}-50 dark:hover:bg-gray-800 dark:bg-gray-800/50`}
                    onDragStart={(event) => {
                      onDragStart(event, template.type as NodeType, { name: template.name, type: template.type });
                    }}
                    draggable
                  >
                    <div className='flex items-center space-x-3'>
                      <div className={`p-2 bg-${template.color}-100 rounded-lg`}>
                        <IconComponent className={`w-4 h-4 text-${template.color}-600`} />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-slate-700 group-hover:text-slate-900 dark:text-gray-200 dark:group-hover:text-white'>
                          {template.name}
                        </p>
                        <p className='text-xs text-slate-500 dark:text-gray-400'>{template.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* System Steps */}
        <div>
          <button onClick={() => toggleSection('system')} className='flex items-center justify-between w-full text-left mb-3'>
            <div className='flex items-center space-x-2'>
              <div className='p-1 bg-blue-500 rounded-lg'>
                <LaptopMinimal className='w-4 h-4 text-white' />
              </div>
              <h3 className='font-semibold text-slate-700 dark:text-gray-200'>System Prompts</h3>
              <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full'>
                {Object.values(systemSteps.steps).flat().length}
              </span>
            </div>
            {expandedSections.system ? (
              <ChevronDown className='w-4 h-4 text-slate-500' />
            ) : (
              <ChevronRight className='w-4 h-4 text-slate-500' />
            )}
          </button>

          {expandedSections.system && (
            <div className='space-y-4'>
              {Object.entries(filteredSystemSteps).map(([category, steps]) => (
                <div key={category}>
                  <h4 className='text-sm font-medium text-slate-600 mb-2 px-2 py-1 bg-slate-100 dark:bg-gray-800 dark:text-gray-300 rounded-lg'>
                    {category}
                  </h4>
                  <div className='space-y-2'>
                    {(steps as any[]).map((step: any, stepIndex: number) => (
                      <div
                        key={`${category}-${stepIndex}`}
                        className='group p-3 border border-slate-200 dark:border-gray-700 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:bg-blue-50 dark:hover:bg-gray-800 dark:bg-gray-800/50'
                        onDragStart={(event) => {
                          onDragStart(event, 'genericNode', step);
                        }}
                        draggable
                      >
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center space-x-3 flex-1 min-w-0'>
                            <div className='p-1.5 bg-blue-100 rounded-lg'>
                              <Sparkles className='w-4 h-4 text-blue-600' />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='text-sm font-medium text-slate-700 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-400 truncate'>
                                {step.name}
                              </p>
                              {step.description && (
                                <p className='text-xs text-slate-500 dark:text-gray-400 mt-1 line-clamp-2'>{step.description}</p>
                              )}
                            </div>
                          </div>
                          <Tooltip text={`Prompt: ${step?.prompt}`} width={300}>
                            <div className='opacity-0 group-hover:opacity-100 transition-opacity'>
                              <Sparkles className='w-4 h-4 text-blue-600' />
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Steps */}
        <div>
          <div className='flex items-center justify-between mb-3'>
            <button onClick={() => toggleSection('custom')} className='flex items-center space-x-2'>
              <div className='p-1 bg-green-500 rounded-lg'>
                <NotebookPen className='w-4 h-4 text-white' />
              </div>
              <h3 className='font-semibold text-slate-700 dark:text-gray-200'>Custom Prompts</h3>
              <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>{customSteps.steps.length}</span>
            </button>
            {isOwner && (
              <div className='flex items-center space-x-2'>
                <div onClick={() => console.log('AddCustomStep wrapper clicked')}>
                  <AddCustomStep editStep={editStep} setEditstep={setEditstep} />
                </div>
                {/* <span className='text-xs text-slate-500'>Add step</span> */}
              </div>
            )}
          </div>

          {expandedSections.custom && (
            <div className='space-y-2'>
              {filteredCustomSteps.length > 0 ? (
                filteredCustomSteps.map((step: any, index: number) => (
                  <div
                    key={`custom-${index}`}
                    className='relative group p-3 border border-slate-200 dark:border-gray-700 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-green-300 hover:shadow-md hover:bg-green-50 dark:hover:bg-gray-800 dark:bg-gray-800/50'
                    onDragStart={(event) => {
                      onDragStart(event, 'genericNode', step);
                    }}
                    draggable
                  >
                    {isOwner && (
                      <div className='absolute -top-2 -right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <button
                          onClick={() => handleEdit(step)}
                          className='p-1 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors'
                        >
                          <SquarePen className='w-3 h-3 text-slate-600' />
                        </button>
                        <button
                          onClick={() => triggerDeleteStep(step._id)}
                          className='p-1 bg-white border border-slate-300 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors dark:bg-gray-700 dark:border-gray-600'
                        >
                          <Trash2 className='w-3 h-3 text-red-500' />
                        </button>
                      </div>
                    )}
                    <div className='flex items-center space-x-3'>
                      <div className='p-1.5 bg-green-100 rounded-lg'>
                        <Sparkles className='w-4 h-4 text-green-600' />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-medium text-slate-700 group-hover:text-green-700 dark:text-gray-200 dark:group-hover:text-green-400 truncate'>
                          {step.name}
                        </p>
                        {step.description && (
                          <p className='text-xs text-slate-500 dark:text-gray-400 mt-1 line-clamp-2'>{step.description}</p>
                        )}
                      </div>
                      <Tooltip text={`Prompt: ${step?.prompt}`} width={300}>
                        <Sparkles className='w-4 h-4 text-green-600' />
                      </Tooltip>
                    </div>
                  </div>
                ))
              ) : (
                <div className='text-center py-8'>
                  <div className='w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center'>
                    <NotebookPen className='w-8 h-8 text-slate-400' />
                  </div>
                  <p className='text-sm text-slate-500 dark:text-gray-400 mb-2'>No custom steps yet</p>
                  <p className='text-xs text-slate-400'>Create your first custom step</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernSidebar;
