import React, { useCallback, useState } from 'react';
import { useAuth } from '../../../auth/useAuth';
import { useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useGetWorkflowsRequestQuery } from '../../../utils/services/genericService';
import { WorkflowsTable } from '../components/WorkflowsTable';
import { TabSwitcher } from '../components/TabSwitcher';
import { Searchbar } from '../../../utils/helperComponents/Searchbar';
import { debounce } from 'lodash';
import { useNavigate, useSearchParams } from 'react-router';
import Button from '../../../utils/helperComponents/Button';
import { Plus } from 'lucide-react';

type TabType = 'personal' | 'contributions';

export const Workflows: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'personal');
  const [tempSearchText, setTempSearchText] = useState(searchParams.get('search') || '');

  const searchText = searchParams.get('search') || '';

  // queries
  const ownerWorkflows = useApiQuery(
    useGetWorkflowsRequestQuery,
    `/workflow/getWorkflowsByCreatorId?creatorId=${user?.id}&search=${searchText}`,
    { skipQuery: !Boolean(user?.id && activeTab === 'personal') },
  );

  const contributionWorkflows = useApiQuery(
    useGetWorkflowsRequestQuery,
    `/workflow/getContributorWorkflows?contributorId=${user?.id}&search=${searchText}`,
    { skipQuery: !Boolean(user?.id && activeTab !== 'personal') },
  );

  const ownerWorkflowsList = ownerWorkflows?.data?.workflows || [];
  const contributionWorkflowsList = contributionWorkflows?.data?.workflows || [];

  const handleSearch = useCallback(
    debounce((val: string) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        if (val) {
          params.set('search', val);
        } else {
          params.delete('search');
        }
        return params;
      });
    }, 600),
    [setSearchParams],
  );

  const handleInput = (val: string) => {
    setTempSearchText(val);
    handleSearch(val);
  };

  // ✅ update tab in URL
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setTempSearchText('');
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('tab', tab);
      params.delete('search');
      return params;
    });
  };

  const currentWorkflows = activeTab === 'personal' ? ownerWorkflowsList : contributionWorkflowsList;

  const isLoading =
    activeTab === 'personal'
      ? ownerWorkflows.isLoading || ownerWorkflows.isFetching
      : contributionWorkflows.isLoading || contributionWorkflows.isFetching;
  return (
    <div className='w-full bg-white dark:bg-gray-900'>
      <div className='px-6 py-2 border-b border-gray-200 dark:border-gray-700'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>Workflows</h1>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='w-[400px]'>
              <Searchbar value={tempSearchText} handleInput={handleInput} placeholder='Search workflows' />
            </div>
            <TabSwitcher activeTab={activeTab} setActiveTab={handleTabChange} />
            <Button triggerClick={() => navigate('/prompt-flow/workflows/new')} label={'Create Workflow'} icon={Plus} />
          </div>
        </div>
      </div>
      <WorkflowsTable workflows={currentWorkflows} activeTab={activeTab} isLoading={isLoading} />
    </div>
  );
};
