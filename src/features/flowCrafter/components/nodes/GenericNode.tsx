import React from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { Handle } from '@xyflow/react';

export const GenericNode: React.FC<any> = (props) => {
  const { data, removeStep } = props;

  // Extract step information from data
  const stepName = data?.name || 'Unnamed Step';
  const stepPrompt = data?.prompt || 'No prompt available';

  return (
    <div className='border border-gray-300 rounded-lg bg-white shadow-sm min-w-[200px] max-w-[300px] border-l-4 border-l-blue-500'>
      <Handle type='source' position={'top' as any} id='a' style={{ background: '#6382e8ff' }} />
      {/* Header */}
      <div className='bg-blue-50 px-2 py-1 border-b border-gray-200 rounded-t-lg'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-semibold text-gray-800 truncate'>{stepName}</h3>
          {/* <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {stepCategory}
          </span> */}
          <Trash2 className='w-3 h-3 mr-1 hover:text-red-500 cursor-pointer' onClick={() => removeStep(props?.id)} />
        </div>
      </div>
      {/* Content */}
      <div className='p-2 space-y-3'>
        {/* Prompt Section */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-xs font-medium text-gray-700 flex items-center'>
              <Sparkles className='w-3 h-3 mr-1' />
              Prompt
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
          <div className='bg-gray-50 p-1 rounded border text-xs text-gray-700 max-h-20 overflow-y-auto'>{stepPrompt}</div>
        </div>
      </div>
      <Handle type='target' position={'bottom' as any} id='b' style={{ background: '#6382e8ff' }} />
    </div>
  );
};
