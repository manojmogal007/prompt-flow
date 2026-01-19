import React, { useCallback, useMemo, useState } from 'react';
import { useAuth } from '../../../auth/useAuth';
import { useApiMutation, useApiQuery } from '../../../utils/customHooks/apiHooks';
import { useGetWorkflowsRequestQuery, usePostWorkflowRequestMutation } from '../../../utils/services/genericService';
import { WorkflowsTable } from '../components/WorkflowsTable';
import { TabSwitcher } from '../components/TabSwitcher';
import { Searchbar } from '../../../utils/helperComponents/Searchbar';
import { debounce } from 'lodash';
import { useSearchParams } from 'react-router';
import Button from '../../../utils/helperComponents/Button';
import { Plus } from 'lucide-react';
import { Pagination } from '../../../utils/helperComponents/Pagination';
import DetailsTaker from '../../flowCrafter/components/DetailsTaker';
import { Modal } from '../../../utils/helperComponents/Modal';
import { useToast } from '../../../hooks/useToast';
import { useSettings } from '../../../hooks/useSettings';
const inputNode = {
  id: 'cb02b245-7d6c-4925-96f2-c30328d972ba',
  type: 'inputNode',
  position: {
    x: 0,
    y: 0,
  },
  data: {
    _id: '68a1e306b2cb2d799ad378a4',
    name: 'Text Input',
    prompt: 'Summarize the following customer review into 2–3 sentences.',
    type: 'system',
    category: 'Summarization',
    __v: 0,
  },
  measured: {
    width: 400,
    height: 112,
  },
};
type TabType = 'personal' | 'community';

export const Workflows: React.FC = () => {
  const { user } = useAuth();
  const { isWorkflowLimitReached, refetchSettings } = useSettings();
  const { showToast } = useToast();
  // const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'personal');
  const [tempSearchText, setTempSearchText] = useState(searchParams.get('search') || '');
  // const [page, setPage] = React.useState(1);
  const [rowsPerpage] = React.useState(10);
  const searchText = searchParams.get('search') || '';
  const page = Number(searchParams.get('page')) || 1;
  // queries
  const ownerWorkflows = useApiQuery(
    useGetWorkflowsRequestQuery,
    `/workflow/getWorkflowsByCreatorId?creatorId=${user?.id}&search=${searchText}&page=${page}&limit=${rowsPerpage}`,
    { skipQuery: !Boolean(user?.id) },
  );

  const contributionWorkflows = useApiQuery(
    useGetWorkflowsRequestQuery,
    `/workflow/getContributorWorkflows?contributorId=${user?.id}&search=${searchText}&page=${page}&limit=${rowsPerpage}`,
    { skipQuery: !Boolean(user?.id) },
  );

  const saveWorkflow = useApiMutation(usePostWorkflowRequestMutation, '/workflow/createWorkflow', {
    onSuccess: (data: any) => {
      showToast(data?.message || 'Workflow created successfully', 'success');
      refetchSettings();
      // navigate(`/prompt-flow/workflows/local/${encodeNameAndId(data?.workflow?.name, data?.workflow?._id)}`);
    },
    onError: (error: any) => {
      showToast(error.data?.message || 'Something went wrong', 'error');
    },
  });

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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setTempSearchText('');
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('tab', tab);
      params.delete('search');
      params.set('page', '1');
      return params;
    });
  };

  const handleToggle = () => {
    setOpen((prev: boolean) => !prev);
  };

  const handleChange = (val: string, key: string) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };
  const payloadValidation = useMemo(() => {
    if (isWorkflowLimitReached) return true;
    if (formData.name) return false;
    return true;
  }, [formData, isWorkflowLimitReached]);

  const triggerSaveWorkflow = async () => {
    if (payloadValidation || saveWorkflow?.isLoading || isWorkflowLimitReached) return;
    const payload = {
      name: formData.name,
      description: formData.description,
      workflowJson: { nodes: [inputNode], edges: [] },
      email: user?.email,
      creatorId: user?.id,
      createdBy: `${user?.firstName} ${user?.lastName}`,
    };

    // const res: any = await saveWorkflow?.handleTrigger(payload);
    await saveWorkflow?.handleTrigger(payload);
    setFormData({});
    setOpen(false);
  };

  const handlePageChange = (page: number) => {
    // setPage(page);
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('page', page.toString());
      return params;
    });
  };
  const currentWorkflows = activeTab === 'personal' ? ownerWorkflowsList : contributionWorkflowsList;

  const isLoading =
    activeTab === 'personal'
      ? ownerWorkflows.isLoading || ownerWorkflows.isFetching
      : contributionWorkflows.isLoading || contributionWorkflows.isFetching;
  const totalCount = activeTab === 'personal' ? ownerWorkflows?.data?.total || 0 : contributionWorkflows?.data?.total || 0;
  const totalPages = activeTab === 'personal' ? Math.ceil(totalCount / rowsPerpage) : Math.ceil(totalCount / rowsPerpage);
  return (
    <div className='w-full bg-white dark:bg-dark-900'>
      <Modal isOpen={open} onClose={handleToggle}>
        <div className='mb-4 text-center'>
          <h3 className='text-xl font-semibold flex items-center justify-center dark:text-dark-100'>Create workflow</h3>
        </div>
        <div className='border-t border-gray-200 dark:border-dark-700 mb-2'></div>
        <DetailsTaker
          handleClose={handleToggle}
          name={formData.name}
          description={formData.description}
          handleSave={triggerSaveWorkflow}
          handleChange={handleChange}
          validation={payloadValidation}
        />
      </Modal>
      <div className='px-6 py-2 border-b border-gray-200 dark:border-dark-700'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            {/* <h1 className='text-xl font-semibold text-gray-900 dark:text-gray-100'>Workflows</h1> */}
            <div className='w-[400px]'>
              <Searchbar value={tempSearchText} handleInput={handleInput} placeholder='Search workflows' />
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {activeTab === 'personal' && <Button triggerClick={handleToggle} label={'Create Workflow'} icon={Plus} />}
            <TabSwitcher activeTab={activeTab} setActiveTab={handleTabChange} />
          </div>
        </div>
      </div>
      <WorkflowsTable workflows={currentWorkflows} activeTab={activeTab} isLoading={isLoading} />
      <div className='px-1'>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={rowsPerpage}
          totalItems={totalCount}
        />
      </div>
    </div>
  );
};
