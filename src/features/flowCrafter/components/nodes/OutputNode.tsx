import React, { useState } from 'react';
import { Download, FileText, Copy, Check, Eye } from 'lucide-react';
import { Handle } from '@xyflow/react';

export const OutputNode: React.FC<any> = (props) => {
  const { data } = props;
  const [copied, setCopied] = useState(false);

  const outputText = data?.output || 'No output available';
  const outputName = data?.name || 'Output';
  const outputType = data?.type || 'text';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${outputName}_output.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='group relative border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[280px] max-w-[400px] border-l-4 border-l-purple-500 hover:border-l-purple-600'>
      {/* Connection handles */}
      <Handle
        type='source'
        position={'top' as any}
        id='a'
        className='!w-3 !h-3 !bg-purple-500 hover:!bg-purple-600 !border-2 !border-white !shadow-lg'
        style={{ background: '#8b5cf6' }}
      />

      {/* Header with gradient background */}
      <div className='bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 px-4 py-3 border-b border-purple-200 dark:border-purple-900/50 rounded-t-xl'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2 flex-1'>
            <div className='p-1.5 bg-purple-500 rounded-lg'>
              <FileText className='w-4 h-4 text-white' />
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='text-sm font-semibold text-purple-800 dark:text-purple-100 truncate'>{outputName}</h3>
              <div className='flex items-center space-x-2'>
                <span className='text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded-full'>{outputType}</span>
                <span className='text-xs text-purple-600 dark:text-purple-300'>Output Node</span>
              </div>
            </div>
          </div>
          <div className='flex items-center space-x-1'>
            <button
              onClick={() => copyToClipboard(outputText)}
              className='p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/50 rounded-lg transition-colors duration-200'
              title='Copy output'
            >
              {copied ? <Check className='w-3 h-3' /> : <Copy className='w-3 h-3' />}
            </button>
            <button
              onClick={downloadOutput}
              className='p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/50 rounded-lg transition-colors duration-200'
              title='Download output'
            >
              <Download className='w-3 h-3' />
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className='p-4 space-y-3'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-1'>
              <Eye className='w-3 h-3 text-purple-600 dark:text-purple-400' />
              <span>Generated Output</span>
            </label>
            <div className='flex items-center space-x-1 text-xs text-purple-600 dark:text-purple-400'>
              <div className='w-2 h-2 bg-purple-500 rounded-full animate-pulse'></div>
              <span>Complete</span>
            </div>
          </div>
          <div className='bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto'>
            <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap'>{outputText}</p>
          </div>
        </div>

        {/* Status bar */}
        <div className='flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700'>
          <div className='flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400'>
            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            <span>Generated</span>
          </div>
          <div className='text-xs text-gray-500 dark:text-gray-400'>{outputText.length} chars</div>
        </div>
      </div>
    </div>
  );
};

export default OutputNode;



