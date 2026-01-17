import React, { useState, useRef, useEffect } from 'react';
import { Play, X, CheckCircle2, AlertCircle, Loader2, Clock, Zap, Copy, Check } from 'lucide-react';
import { usePostExecutionRequestMutation, useGetExecutionRequestQuery } from '../../../utils/services/genericService';
import { useApiMutation, useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useAuth } from '../../../auth/useAuth';

interface ExecutionPanelProps {
  nodes: any[];
  edges: any[];
  workflowId?: string;
  onClose: () => void;
  executionId: string | null;
  setExecutionId: (id: string | null) => void;
  onRestoreNodes: () => void;
}

const renderOutput = (output: any) => {
  if (typeof output === 'object' && output !== null) {
    // If it has an 'output' field, just show that (cleaner)
    if (output.output) {
      return typeof output.output === 'string' ? output.output : JSON.stringify(output.output, null, 2);
    }
    return JSON.stringify(output, null, 2);
  }
  return output || 'No output';
};

export const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  nodes,
  edges,
  workflowId,
  onClose,
  executionId,
  setExecutionId,
  onRestoreNodes,
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState<Record<string, boolean | string>>({ isCopied: false });

  // Initialize input from input node if available
  const [userInput, setUserInput] = useState(() => {
    const inputNode = nodes.find((n) => n.type === 'inputNode');
    return inputNode?.data?.text || '';
  });

  const hasAutoRun = useRef(false);

  const executeWorkflow = useApiMutation(usePostExecutionRequestMutation, '/execution/execute', {
    onError: (error: any) => console.error('Execution failed:', error),
  });
  const isExecuting = executeWorkflow.isLoading;

  // Dynamic polling interval
  const [pollingInterval, setPollingInterval] = useState(0);

  // Poll for execution status every 2 seconds
  const statusQuery = useApiQuery(useGetExecutionRequestQuery, `/execution/execution/${executionId}?userId=${user?.id}`, {
    skipQuery: !executionId,
    polling: pollingInterval,
  });
  const executionStatus: any = statusQuery.data;

  // Get final results when completed
  const resultsQuery = useApiQuery(
    useGetExecutionRequestQuery,
    `/execution/execution/${executionId}/results${user?.id ? `?userId=${user.id}` : ''}`,
    {
      skipQuery: !executionId || executionStatus?.execution?.status !== 'completed',
    },
  );
  const executionResults: any = resultsQuery.data;

  const status = executionStatus?.execution?.status;
  const progress = executionStatus?.execution?.progress || 0;
  const currentStep = executionStatus?.execution?.currentStep;
  const currentStepName = executionStatus?.execution?.currentStepName;
  const isRunning = status === 'running';
  const isCompleted = status === 'completed';
  const hasFailed = status === 'failed';

  // Stop polling when completed or failed
  React.useEffect(() => {
    if (status === 'running' || status === 'pending') {
      setPollingInterval(2000);
    } else if (status === 'completed' || status === 'failed' || status === 'cancelled') {
      setPollingInterval(0);
      onRestoreNodes();
    }
  }, [status, isCompleted, hasFailed, executionId]);

  const handleExecute = async (overrideInput?: string) => {
    const inputToUse = overrideInput || userInput;
    if (!inputToUse.trim()) {
      return;
    }

    try {
      const payload = {
        workflowId: workflowId,
        workflowJson: {
          nodes: nodes,
          edges: edges,
        },
        initialInput: inputToUse,
        executionName: `Execution - ${new Date().toLocaleString()}`,
        user,
      };

      const response: any = await executeWorkflow.handleTrigger(payload);
      setExecutionId(response?.data?.executionId);
    } catch (error: any) {
      console.error('Execution failed:', error);
    }
  };

  // Auto-run effect
  useEffect(() => {
    if (userInput && !executionId && !hasAutoRun.current) {
      hasAutoRun.current = true;
      handleExecute(userInput);
    }
  }, []);

  const handleReset = () => {
    setExecutionId(null);
    // Keep userInput for editing
  };

  const copyToClipboard = async (text: string, nodeId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied({ isCopied: true, nodeId });
      setTimeout(() => setCopied({ isCopied: false }), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-white dark:bg-dark-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col'>
        {/* Header */}
        <div className='px-6 py-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
              <Play className='w-5 h-5 text-blue-600 dark:text-blue-400' />
            </div>
            <div>
              <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                {executionStatus?.execution?.executionName || 'Execute Workflow'}
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {nodes.length} nodes • {edges.length} connections
              </p>
            </div>
          </div>
          <button onClick={onClose} className='p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors'>
            <X className='w-5 h-5 text-gray-500 dark:text-gray-400' />
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6 space-y-6'>
          {/* Input Section */}
          {!executionId && (
            <div className='space-y-3'>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>Initial Input</label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder='Enter your text to process through the workflow...'
                className='w-full px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-lg 
                         bg-white dark:bg-dark-900 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder-gray-400 dark:placeholder-gray-500
                         resize-none transition-all'
                rows={6}
                disabled={isExecuting || isRunning}
              />
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                This text will be processed through your workflow starting from the first node.
              </p>
            </div>
          )}

          {/* Status Section */}
          {executionId && executionStatus && (
            <div className='space-y-4'>
              {/* Status Badge */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  {isRunning && (
                    <>
                      <Loader2 className='w-5 h-5 text-blue-600 animate-spin' />
                      <span className='font-semibold text-blue-600 dark:text-blue-400'>Running</span>
                    </>
                  )}
                  {isCompleted && (
                    <>
                      <CheckCircle2 className='w-5 h-5 text-green-600' />
                      <span className='font-semibold text-green-600 dark:text-green-400'>Completed</span>
                    </>
                  )}
                  {hasFailed && (
                    <>
                      <AlertCircle className='w-5 h-5 text-red-600' />
                      <span className='font-semibold text-red-600 dark:text-red-400'>Failed</span>
                    </>
                  )}
                  {status === 'pending' && (
                    <>
                      <Clock className='w-5 h-5 text-yellow-600' />
                      <span className='font-semibold text-yellow-600 dark:text-yellow-400'>Pending</span>
                    </>
                  )}
                </div>
                <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>{progress}%</span>
              </div>

              {/* Progress Bar */}
              <div className='relative'>
                <div className='w-full bg-gray-200 dark:bg-dark-700 rounded-full h-3 overflow-hidden'>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      hasFailed ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Current Step */}
              {isRunning && currentStep && (
                <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                  <div className='flex items-center gap-2 mb-2'>
                    <Zap className='w-4 h-4 text-blue-600 dark:text-blue-400' />
                    <span className='text-sm font-medium text-blue-900 dark:text-blue-100'>Currently Processing</span>
                  </div>
                  <p className='text-sm text-blue-700 dark:text-blue-300 font-mono'>{currentStepName || currentStep}</p>
                </div>
              )}

              {/* Metadata */}
              {executionStatus.execution.totalTokensUsed > 0 && (
                <div className='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                  <div className='flex items-center gap-1'>
                    <Zap className='w-4 h-4' />
                    <span>{executionStatus.execution.totalTokensUsed} tokens used</span>
                  </div>
                  {executionStatus.execution.executionTime && (
                    <div className='flex items-center gap-1'>
                      <Clock className='w-4 h-4' />
                      <span>{(executionStatus.execution.executionTime / 1000).toFixed(2)}s</span>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {hasFailed && executionStatus.execution.error && (
                <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
                  <div className='flex items-start gap-2'>
                    <AlertCircle className='w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5' />
                    <div>
                      <h4 className='font-semibold text-red-900 dark:text-red-100 mb-1'>Execution Failed</h4>
                      <p className='text-sm text-red-700 dark:text-red-300'>{executionStatus.execution.error.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Results Error */}
          {resultsQuery.isError && (
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4'>
              <p className='text-sm text-red-600 dark:text-red-400'>Failed to load results. Please try again.</p>
            </div>
          )}

          {/* Results Loading */}
          {isCompleted && resultsQuery.isLoading && (
            <div className='flex items-center justify-center p-8'>
              <Loader2 className='w-6 h-6 text-blue-600 animate-spin' />
              <span className='ml-2 text-gray-600 dark:text-gray-400'>Loading results...</span>
            </div>
          )}

          {/* Results Section */}
          {isCompleted && executionResults && (
            <div className='space-y-4'>
              {/* Final Output */}
              <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2 mb-3'>
                    <CheckCircle2 className='w-5 h-5 text-green-600 dark:text-green-400' />
                    <h3 className='font-semibold text-green-900 dark:text-green-100'>Final Output</h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(executionResults.finalOutput?.output, 'final-output')}
                    className='p-1.5 text-green-600 hover:text-green-700 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/50 rounded-lg transition-colors duration-200'
                    title='Copy prompt'
                  >
                    {copied?.isCopied && copied.nodeId === 'final-output' ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
                  </button>
                </div>
                <div className='bg-white dark:bg-dark-900 rounded-lg p-4 border border-green-200 dark:border-green-800'>
                  <p className='text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap'>
                    {renderOutput(executionResults.finalOutput?.output)}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Results */}
              <div>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-3'>Step-by-Step Results</h3>
                <div className='space-y-3'>
                  {executionResults.executionOrder?.map((nodeId: string, index: number) => {
                    const result = executionResults.results ? executionResults.results[nodeId] : null;
                    if (!result) return null;

                    // Hide Input Node from results list
                    if (
                      result.stepName === 'Text Input' ||
                      result.stepName === 'Input' ||
                      nodes.find((n) => n.id === nodeId)?.type === 'inputNode'
                    ) {
                      return null;
                    }

                    return (
                      <div key={nodeId} className='bg-gray-50 dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600'>
                        <div className='flex items-center gap-2 mb-2 justify-between'>
                          <div className='flex items-center gap-2 mb-2'>
                            <div className='w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center'>
                              <span className='text-xs font-semibold text-blue-600 dark:text-blue-400'>{index}</span>
                            </div>
                            <span className='font-medium text-gray-900 dark:text-white text-sm'>{result.stepName || nodeId}</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(result.output, nodeId)}
                            className='p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200'
                            title='Copy prompt'
                          >
                            {copied?.isCopied && copied.nodeId === nodeId ? <Check className='w-3 h-3' /> : <Copy className='w-3 h-3' />}
                          </button>
                        </div>
                        <p className='text-sm text-gray-700 dark:text-gray-300 ml-8 whitespace-pre-wrap'>{renderOutput(result.output)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='px-6 py-4 border-t border-gray-200 dark:border-dark-700 flex items-center justify-between'>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            {executionId ? `Execution ID: ${executionId.slice(0, 8)}...` : 'Ready to execute'}
          </div>
          <div className='flex items-center gap-3'>
            {!executionId && (
              <button
                onClick={() => handleExecute()}
                disabled={!userInput.trim() || isExecuting}
                className='px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-dark-600
                         text-white font-medium rounded-lg transition-colors
                         disabled:cursor-not-allowed flex items-center gap-2'
              >
                {isExecuting ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Starting...</span>
                  </>
                ) : (
                  <>
                    <Play className='w-4 h-4' />
                    <span>Execute Workflow</span>
                  </>
                )}
              </button>
            )}
            {executionId && (isCompleted || hasFailed) && (
              <button
                onClick={handleReset}
                className='px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors'
              >
                Run Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
