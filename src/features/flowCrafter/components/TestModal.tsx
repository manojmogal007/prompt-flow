import React, { useState } from 'react';
import { ModalV2 } from '../../../utils/helperComponents/ModalV2';
import { Plus } from 'lucide-react';

export const TestModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => {
          console.log('Test modal button clicked');
          setIsOpen(true);
        }}
        className='fixed top-4 right-4 z-[99999] p-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-colors'
        style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 99999 }}
      >
        <Plus className='w-5 h-5' />
        Test Modal
      </button>

      <ModalV2 isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-800 mb-4'>Test Modal</h2>
          <p className='text-gray-600 mb-6'>This is a test modal to verify visibility.</p>
          <button
            onClick={() => setIsOpen(false)}
            className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors'
          >
            Close
          </button>
        </div>
      </ModalV2>
    </>
  );
};



