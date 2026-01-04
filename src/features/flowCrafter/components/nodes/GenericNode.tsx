import React, { useState } from 'react';
import { Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { Handle } from '@xyflow/react';

export const GenericNode: React.FC<any> = (props) => {
  const { data, removeStep, edges, id, ...rest } = props;
  const [copied, setCopied] = useState(false);

  // Extract step information from data
  const stepName = data?.name || 'Unnamed Step';
  const stepPrompt = data?.prompt || 'No prompt available';
  const stepCategory = data?.category || 'General';
  const isNodeConnected = edges?.some((edge: any) => edge.target === id || edge.source === id);

  console.log('data', rest, edges);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className='group relative border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px] max-w-[400px] border-l-4 border-l-blue-500 hover:border-l-blue-600'>
      {/* Connection handles */}
      <Handle
        type='source'
        position={'top' as any}
        id='a'
        className='!w-3 !h-3 !bg-blue-500 hover:!bg-blue-600 !border-2 !border-white !shadow-lg'
        style={{ background: '#3b82f6' }}
      />
      <Handle
        type='target'
        position={'bottom' as any}
        id='b'
        className='!w-3 !h-3 !bg-blue-500 hover:!bg-blue-600 !border-2 !border-white !shadow-lg'
        style={{ background: '#3b82f6' }}
      />

      {/* Header with gradient background */}
      <div className='bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 px-4 py-3 border-b border-blue-200 dark:border-blue-900/50 rounded-t-xl'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 flex-1'>
            <div className='p-1.5 bg-blue-500 rounded-lg'>
              <Sparkles className='w-4 h-4 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-semibold text-blue-800 dark:text-blue-100 truncate'>{stepName}</h3>
              <div className='flex items-center space-x-2'>
                <span className='text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 px-2 py-0.5 rounded-full'>
                  {stepCategory}
                </span>
                <span className='text-xs text-blue-600 dark:text-blue-300'>Processing Step</span>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-1'>
            <button
              onClick={() => copyToClipboard(stepPrompt)}
              className='p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200'
              title='Copy prompt'
            >
              {copied ? <Check className='w-3 h-3' /> : <Copy className='w-3 h-3' />}
            </button>
            {/* <button
              className='p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200'
              title='Settings'
            >
              <Settings className='w-3 h-3' />
            </button> */}
            <button
              className='p-1.5 text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/50 rounded-lg transition-colors duration-200'
              onClick={() => removeStep(props?.id)}
              title='Delete node'
            >
              <Trash2 className='w-3 h-3' />
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className='p-4 space-y-3'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1'>
              <Sparkles className='w-3 h-3 text-blue-600' />
              <span>Prompt</span>
            </label>
            {/* <div className='flex items-center space-x-1 text-xs text-blue-600 dark:text-blue-400'>
              <Play className='w-3 h-3' />
              <span>Ready</span>
            </div> */}
          </div>
          <div className='bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-h-24 overflow-y-auto'>
            <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed'>{stepPrompt}</p>
          </div>
        </div>

        {/* Status bar */}
        <div className='flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700'>
          <div className='flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400'>
            <div className={`w-2 h-2 ${isNodeConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`}></div>
            <span>{isNodeConnected ? 'Connected' : 'Waiting to connect'}</span>
          </div>
          <div className='text-xs text-gray-500 dark:text-gray-400'>{stepPrompt.length} chars</div>
        </div>
      </div>
    </div>
  );
};
