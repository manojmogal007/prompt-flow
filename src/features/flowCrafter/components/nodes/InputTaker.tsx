import React, { useCallback, useEffect, useState } from 'react';
import { AlignJustify, FileText, Zap } from 'lucide-react';
import { Handle, useNodeId, useReactFlow } from '@xyflow/react';
import { debounce } from 'lodash';

export const InputTaker: React.FC<any> = ({ data, onPromptChange }) => {
  const nodeId = useNodeId();
  const { setNodes } = useReactFlow();
  const [text, setText] = useState(data?.text || '');

  // keep local state synced with parent when node updates externally
  useEffect(() => {
    setText(data?.text || '');
  }, [data?.text]);

  // debounced sync to parent/liveblocks
  const debouncedSync = useCallback(
    debounce((newText: string) => {
      onPromptChange(newText);

      // optional: also update this node's data in ReactFlow directly
      setNodes((nodes) => nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, text: newText } } : node)));
    }, 1000),
    [nodeId, onPromptChange, setNodes],
  );

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText); // immediate local update (no focus loss)
    debouncedSync(newText); // sync with delay
  };

  return (
    <div className='group relative border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px] max-w-[400px] border-l-4 border-l-emerald-500 hover:border-l-emerald-600'>
      {/* Connection handles */}
      <Handle
        type='target'
        position={'bottom' as any}
        id='b'
        className='!w-3 !h-3 !bg-emerald-500 hover:!bg-emerald-600 !border-2 !border-white !shadow-lg'
        style={{ background: '#10b981' }}
      />

      {/* Header with gradient background */}
      <div className='bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 px-4 py-3 border-b border-emerald-200 dark:border-emerald-900/50 rounded-t-xl'>
        <div className='flex items-center space-x-2'>
          <div className='p-1.5 bg-emerald-500 rounded-lg'>
            <FileText className='w-4 h-4 text-white' />
          </div>
          <div className='flex-1'>
            <h3 className='text-sm font-semibold text-emerald-800 dark:text-emerald-100 truncate'>{data?.name || 'Text Input'}</h3>
            {/* <p className='text-xs text-emerald-600 dark:text-emerald-300'>Input Node</p> */}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className='p-4 space-y-3'>
        <div className='space-y-2'>
          <label className='text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1'>
            <AlignJustify className='w-3 h-3 text-emerald-600 dark:text-emerald-400' />
            <span>Input Text</span>
            {text.length > 0 && (
              <span className='ml-auto text-xs text-emerald-600 dark:text-emerald-400 font-medium'>{text.length} chars</span>
            )}
          </label>

          <div className='relative'>
            <textarea
              value={text}
              rows={4}
              onChange={handleTextChange}
              className='w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:border-emerald-500 transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none shadow-sm hover:shadow-md'
              placeholder='Enter your input text here...'
            />
            {text.length > 0 && (
              <div className='absolute top-2 right-2'>
                <div className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse'></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className='absolute top-2 right-2'>
        <div className='flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/50 px-2 py-1 rounded-full'>
          <Zap className='w-3 h-3' />
          <span>Active</span>
        </div>
      </div>
    </div>
  );
};

export default InputTaker;
