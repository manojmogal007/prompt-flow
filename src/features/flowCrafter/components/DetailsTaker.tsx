import { type FC } from 'react';
import { Input } from '../../../utils/helperComponents/Input';
import Button from '../../../utils/helperComponents/Button';
import { SaveAll } from 'lucide-react';
import { Infobar } from '../../../utils/helperComponents/Infobar';
import { useSettings } from '../../../hooks/useSettings';

interface Props {
  name: string;
  description: string;
  handleChange: (val: string, key: string) => void;
  handleSave: () => void;
  handleClose: () => void;
  validation: boolean;
}

const DetailsTaker: FC<Props> = ({ name, description, handleChange, handleSave, handleClose, validation }) => {
  const { isWorkflowLimitReached } = useSettings();
  return (
    <div className='space-y-4'>
      {isWorkflowLimitReached && (
        <Infobar
          title={`Workflow Limit Reached`}
          type='error'
          description='You’ve reached the maximum number of workflows. Upgrade your plan to create more.'
        />
      )}
      <label className='font-semibold text-sm text-slate-800 dark:text-dark-100'>Workflow name*</label>
      <Input value={name} handleInputChange={handleChange} placeHolder='Workflow name' valKey='name' size='md' />
      {/* <Input value={description} handleInputChange={handleChange} placeHolder='Workflow Description' valKey='description' size='md' /> */}
      <label className='font-semibold text-sm text-slate-800 dark:text-dark-100'>Description</label>
      <textarea
        value={description || ''}
        rows={4}
        onChange={(e) => handleChange(e.target.value, 'description')}
        className='mt-1 block w-full pr-3 py-2 pl-3 border border-gray-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-dark-500 bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100'
        placeholder='Workflow description'
      />
      <div className='flex justify-center gap-2'>
        <Button triggerClick={handleSave} label='Save' size='md' icon={SaveAll} disabled={validation} />
        <Button triggerClick={handleClose} label='Cancel' size='md' isHollow={true} />
      </div>
    </div>
  );
};

export default DetailsTaker;
