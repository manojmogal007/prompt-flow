import React, { useState } from 'react';
import { Database, BarChart3, Filter, Settings, Play, Pause } from 'lucide-react';
import { Handle } from '@xyflow/react';

export const DataProcessingNode: React.FC<any> = (props) => {
  const { data } = props;
  const [isProcessing, setIsProcessing] = useState(false);

  const nodeName = data?.name || 'Data Processing';
  const processingType = data?.type || 'transform';
  const status = isProcessing ? 'Processing' : 'Ready';

  const toggleProcessing = () => {
    setIsProcessing(!isProcessing);
  };

  return (
    <div className='group relative border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px] max-w-[400px] border-l-4 border-l-indigo-500 hover:border-l-indigo-600'>
      {/* Connection handles */}
      <Handle
        type='source'
        position='top'
        id='a'
        className='!w-3 !h-3 !bg-indigo-500 hover:!bg-indigo-600 !border-2 !border-white !shadow-lg'
        style={{ background: '#6366f1' }}
      />
      <Handle
        type='target'
        position='bottom'
        id='b'
        className='!w-3 !h-3 !bg-indigo-500 hover:!bg-indigo-600 !border-2 !border-white !shadow-lg'
        style={{ background: '#6366f1' }}
      />

      {/* Header with gradient background */}
      <div className='bg-gradient-to-r from-indigo-50 to-indigo-100 px-4 py-3 border-b border-indigo-200 rounded-t-xl'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 flex-1'>
            <div className='p-1.5 bg-indigo-500 rounded-lg'>
              <Database className='w-4 h-4 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-semibold text-indigo-800 truncate'>{nodeName}</h3>
              <div className='flex items-center space-x-2'>
                <span className='text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full'>{processingType}</span>
                <span className='text-xs text-indigo-600'>Data Processing</span>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-1'>
            <button
              onClick={toggleProcessing}
              className={`p-1.5 rounded-lg transition-colors duration-200 ${
                isProcessing
                  ? 'text-red-600 hover:text-red-700 hover:bg-red-100'
                  : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100'
              }`}
              title={isProcessing ? 'Stop processing' : 'Start processing'}
            >
              {isProcessing ? <Pause className='w-3 h-3' /> : <Play className='w-3 h-3' />}
            </button>
            <button
              className='p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100 rounded-lg transition-colors duration-200'
              title='Settings'
            >
              <Settings className='w-3 h-3' />
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className='p-4 space-y-3'>
        <div className='space-y-3'>
          <div>
            <label className='text-xs font-medium text-gray-700 flex items-center space-x-1 mb-2'>
              <BarChart3 className='w-3 h-3 text-indigo-600' />
              <span>Processing Configuration</span>
            </label>
            <div className='bg-gray-50 border border-gray-200 rounded-lg p-3'>
              <p className='text-sm text-gray-700'>{data?.config || 'Configure your data processing rules...'}</p>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-2'>
              <div className='flex items-center space-x-1 mb-1'>
                <Filter className='w-3 h-3 text-blue-600' />
                <span className='text-xs font-medium text-blue-700'>Filters</span>
              </div>
              <p className='text-xs text-blue-600'>Apply data filters</p>
            </div>
            <div className='bg-purple-50 border border-purple-200 rounded-lg p-2'>
              <div className='flex items-center space-x-1 mb-1'>
                <BarChart3 className='w-3 h-3 text-purple-600' />
                <span className='text-xs font-medium text-purple-700'>Transform</span>
              </div>
              <p className='text-xs text-purple-600'>Transform data format</p>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
          <div className='flex items-center space-x-2 text-xs text-gray-500'>
            <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-indigo-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{status}</span>
          </div>
          <div className='text-xs text-gray-500'>Data Processing Node</div>
        </div>
      </div>
    </div>
  );
};

export default DataProcessingNode;



