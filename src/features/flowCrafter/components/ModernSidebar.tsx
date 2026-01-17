import React, { useState } from 'react';
import {
  LaptopMinimal,
  NotebookPen,
  Trash2,
  Sparkles,
  SquarePen,
  ChevronDown,
  FileText,
  LibraryBig,
  Cable,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../auth/useAuth';
import { useApiMutation, useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useGetStepsRequestQuery, usePostStepsRequestMutation } from '../../../utils/services/genericService';
import { AddCustomStep } from './AddCustomStep';
import { useToast } from '../../../hooks/useToast';
import { Tooltip } from '../../../utils/helperComponents/Tooltip';
import { useParams } from 'react-router';
import { decodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import { Searchbar } from '../../../utils/helperComponents/Searchbar';
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

  const templateNodes = [
    {
      type: 'inputNode',
      name: 'Text Input',
      description: 'Start your workflow with target input',
      icon: FileText,
      color: 'emerald',
    },
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
    (step: any) =>
      step.name.toLowerCase().includes(searchTerm.toLowerCase()) || step.prompt.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredTemplates = templateNodes.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className='h-full flex flex-col'>
      {/* Floating Header */}
      <div className='p-4'>
        <div className='bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-4 rounded-2xl shadow-sm'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20'>
              <LibraryBig className='w-5 h-5 text-white' />
            </div>
            <div>
              <h2 className='text-base font-bold text-gray-900 dark:text-gray-100'>Components</h2>
              <p className='text-xs text-gray-500 dark:text-gray-400'>Drag & drop to build</p>
            </div>
          </div>
          <Searchbar
            value={searchTerm}
            handleInput={setSearchTerm}
            placeholder="Search steps..."
            size="sm"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className='flex-1 overflow-y-auto px-4 pb-4 space-y-4 scrollbar-hide'>

        {/* Actions Section */}
        <div className="bg-white/50 dark:bg-dark-800/50 rounded-2xl border border-slate-200/60 dark:border-dark-700/60 overflow-hidden">
          <button
            onClick={() => toggleSection('actions')}
            className='flex items-center justify-between w-full p-3 hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-colors'
          >
            <div className='flex items-center gap-2.5'>
              <div className='p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg'>
                <Cable className='w-4 h-4 text-purple-600 dark:text-purple-400' />
              </div>
              <span className='text-sm font-semibold text-gray-700 dark:text-gray-200'>Actions</span>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.actions ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className='w-4 h-4 text-gray-400' />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.actions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='px-3 pb-3'
              >
                <div className='space-y-2 pt-1'>
                  {filteredTemplates.map((template, index) => {
                    const IconComponent = template.icon;
                    return (
                      <div
                        key={index}
                        className='group relative flex items-center gap-3 p-3 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl cursor-grab active:cursor-grabbing hover:border-purple-300 dark:hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-200'
                        onDragStart={(event) => {
                          onDragStart(event, template.type as NodeType, { name: template.name, type: template.type });
                        }}
                        draggable
                      >
                        <div className={`p-2 bg-${template.color}-50 dark:bg-${template.color}-900/20 rounded-lg group-hover:bg-${template.color}-100 dark:group-hover:bg-${template.color}-900/40 transition-colors`}>
                          <IconComponent className={`w-4 h-4 text-${template.color}-600 dark:text-${template.color}-400`} />
                        </div>
                        <div>
                          <p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                            {template.name}
                          </p>
                          <p className='text-xs text-gray-500 dark:text-gray-400'>
                            {template.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* System & Custom Steps Sections follow similar pattern... */}

        {/* System Steps */}
        <div className="bg-white/50 dark:bg-dark-800/50 rounded-2xl border border-slate-200/60 dark:border-dark-700/60 overflow-hidden">
          <button
            onClick={() => toggleSection('system')}
            className='flex items-center justify-between w-full p-3 hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-colors'
          >
            <div className='flex items-center gap-2.5'>
              <div className='p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
                <LaptopMinimal className='w-4 h-4 text-blue-600 dark:text-blue-400' />
              </div>
              <span className='text-sm font-semibold text-gray-700 dark:text-gray-200'>System</span>
              <span className='px-1.5 py-0.5 text-[10px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full'>
                {Object.values(systemSteps.steps).flat().length}
              </span>
            </div>
            <motion.div
              animate={{ rotate: expandedSections.system ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className='w-4 h-4 text-gray-400' />
            </motion.div>
          </button>

          <AnimatePresence>
            {expandedSections.system && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='px-3 pb-3'
              >
                <div className='space-y-4 pt-1'>
                  {Object.entries(filteredSystemSteps).map(([category, steps]) => (
                    <div key={category}>
                      <div className='flex items-center gap-2 mb-2'>
                        <h4 className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                          {category}
                        </h4>
                        <div className="h-px flex-1 bg-slate-100 dark:bg-dark-700"></div>
                      </div>
                      <div className='space-y-2'>
                        {(steps as any[]).map((step: any, stepIndex: number) => (
                          <div
                            key={`${category}-${stepIndex}`}
                            className='group relative flex items-center p-3 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200'
                            onDragStart={(event) => {
                              onDragStart(event, 'genericNode', step);
                            }}
                            draggable
                          >
                            <div className="p-2 bg-slate-50 dark:bg-dark-800 rounded-lg mr-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                                {step.name}
                              </p>
                              {step.description && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                                  {step.description}
                                </p>
                              )}
                            </div>
                            <Tooltip text={`Prompt: ${step?.prompt}`} width={300}>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 dark:hover:bg-dark-700 rounded">
                                <FileText className="w-3.5 h-3.5 text-gray-400" />
                              </div>
                            </Tooltip>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white/50 dark:bg-dark-800/50 rounded-2xl border border-slate-200/60 dark:border-dark-700/60 overflow-hidden">
          <div className='flex items-center justify-between w-full p-3 hover:bg-slate-50 dark:hover:bg-dark-700/50 transition-colors cursor-pointer' onClick={() => toggleSection('custom')}>
            <div className='flex items-center gap-2.5'>
              <div className='p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg'>
                <NotebookPen className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
              </div>
              <span className='text-sm font-semibold text-gray-700 dark:text-gray-200'>Custom</span>
              <span className='px-1.5 py-0.5 text-[10px] font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full'>
                {customSteps.steps.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isOwner && (
                <div onClick={(e) => { e.stopPropagation(); console.log('AddCustomStep wrapper clicked') }}>
                  <AddCustomStep editStep={editStep} setEditstep={setEditstep} />
                </div>
              )}
              <motion.div
                animate={{ rotate: expandedSections.custom ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className='w-4 h-4 text-gray-400' />
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {expandedSections.custom && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className='px-3 pb-3'
              >
                <div className='space-y-2 pt-1'>
                  {filteredCustomSteps.length > 0 ? (
                    filteredCustomSteps.map((step: any, index: number) => (
                      <div
                        key={`custom-${index}`}
                        className='group relative flex items-center p-3 bg-white dark:bg-dark-900 border border-slate-200 dark:border-dark-700 rounded-xl cursor-grab active:cursor-grabbing hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-200'
                        onDragStart={(event) => {
                          onDragStart(event, 'genericNode', step);
                        }}
                        draggable
                      >
                        {/* Hover Actions */}
                        {isOwner && (
                          <div className='absolute -top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10'>
                            <button
                              onClick={() => handleEdit(step)}
                              className='p-1 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 rounded-md hover:text-blue-500 transition-colors shadow-sm'
                            >
                              <SquarePen className='w-3 h-3' />
                            </button>
                            <button
                              onClick={() => triggerDeleteStep(step._id)}
                              className='p-1 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 rounded-md hover:text-red-500 transition-colors shadow-sm'
                            >
                              <Trash2 className='w-3 h-3' />
                            </button>
                          </div>
                        )}

                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg mr-3 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                          <Sparkles className="w-4 h-4 text-emerald-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate transition-colors">
                            {step.name}
                          </p>
                          {step.description && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                              {step.description}
                            </p>
                          )}
                        </div>
                        <Tooltip text={`Prompt: ${step?.prompt}`} width={300}>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded cursor-help">
                            <FileText className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                          </div>
                        </Tooltip>
                      </div>
                    ))
                  ) : (
                    <div className='text-center py-6 border-2 border-dashed border-slate-200 dark:border-dark-700 rounded-xl bg-slate-50/50 dark:bg-dark-800/50'>
                      <NotebookPen className='w-6 h-6 text-slate-300 mx-auto mb-2' />
                      <p className='text-xs text-slate-500 dark:text-gray-400'>No custom steps</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default ModernSidebar;
