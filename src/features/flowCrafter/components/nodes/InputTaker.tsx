import React, { useCallback, useState } from 'react';
import { AlignJustify } from 'lucide-react';
import { Handle, useNodeId, useReactFlow } from '@xyflow/react';
import { debounce } from 'lodash';

export const InputTaker: React.FC<any> = (props) => {
  const { data } = props;
  const nodeId = useNodeId();
  const { setNodes } = useReactFlow();
  const [text, setText] = useState('');

  // Extract step information from data
  const stepName = data?.name || 'Text Input';
  //   const stepPrompt = data?.prompt || 'No prompt available';

  const handleUpdateNode = useCallback(
    debounce((text: string) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, text } };
          }
          return node;
        }),
      );
    }),
    [text],
  );

  const handleTextChange = (e: any) => {
    setText(e.target.value);
    handleUpdateNode(e.target.value);
  };
  console.log(text);
  return (
    <div className='border border-gray-300 rounded-lg bg-white shadow-sm min-w-[200px] max-w-[400px] border-l-4 border-l-blue-500'>
      {/* <Handle type='source' position={'top' as any} id='a' style={{ background: '#6382e8ff' }} /> */}
      {/* Header */}
      <div className='bg-blue-50 px-2 py-1 border-b border-gray-200 rounded-t-lg'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-gray-800 truncate'>{stepName}</h3>
          {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {stepCategory}
          </span> */}
        </div>
      </div>
      {/* Content */}
      <div className='p-2 space-y-3'>
        {/* Prompt Section */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-xs font-medium text-gray-700 flex items-center'>
              <AlignJustify className='w-3 h-3 mr-1 mt-0.5' />
              Text
            </label>
            {/* <button
              onClick={() => copyToClipboard(stepPrompt)}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center"
            >
              {copied ? (
                <Check className="w-3 h-3 mr-1" />
              ) : (
                <Copy className="w-3 h-3 mr-1" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button> */}
          </div>
          <div className='w-[300px]'>
            {' '}
            <textarea
              value={text}
              rows={3}
              onChange={handleTextChange}
              className='w-[300px] mt-1 block w-full pr-3 py-2 pl-3 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-white'
              placeholder='Enter text'
            />
          </div>
        </div>
      </div>
      <Handle type='target' position={'bottom' as any} id='b' style={{ background: '#6382e8ff' }} />
    </div>
  );
};

export default InputTaker;
