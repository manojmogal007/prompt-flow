import React, { useCallback, useEffect, useState } from 'react';
import { AlignJustify } from 'lucide-react';
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
    <div className='border border-gray-300 rounded-lg bg-white shadow-sm min-w-[200px] max-w-[400px] border-l-4 border-l-blue-500'>
      <div className='bg-blue-50 px-2 py-1 border-b border-gray-200 rounded-t-lg'>
        <h3 className='text-sm font-semibold text-gray-800 truncate'>{data?.name || 'Text Input'}</h3>
      </div>

      <div className='p-2 space-y-2'>
        <label className='text-xs font-medium text-gray-700 flex items-center'>
          <AlignJustify className='w-3 h-3 mr-1 mt-0.5' />
          Text
        </label>

        <textarea
          value={text}
          rows={3}
          onChange={handleTextChange}
          className='w-[300px] mt-1 block w-full pr-3 py-2 pl-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 bg-white text-gray-900'
          placeholder='Enter text'
        />
      </div>

      <Handle type='target' position='bottom' id='b' style={{ background: '#6382e8ff' }} />
    </div>
  );
};

export default InputTaker;
