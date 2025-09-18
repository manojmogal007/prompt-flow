import { type FC } from 'react';
import { Trash2, User, Users } from 'lucide-react';
import { useParams } from 'react-router';
import Loader from '../../../utils/helperComponents/Loader';
import { useApiMutation } from '../../../utils/customHooks/apiHooks';
import { usePostContributorsRequestMutation } from '../../../utils/services/genericService';
import { useToast } from '../../../hooks/useToast';
import { decodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';

interface Props {
  contributors: any[];
  isLoading: boolean;
}

const getStatus = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const ContributorsTable: FC<Props> = ({ contributors, isLoading }) => {
  const { showToast } = useToast();
  const { encodedParams } = useParams();
  const { id: workflowId } = decodeNameAndId(encodedParams);

  const { handleTrigger } = useApiMutation(usePostContributorsRequestMutation, '/contributor/removeContributor', {
    onSuccess: (data: any) => {
      showToast(data?.message, 'success');
    },
    onError: (error: any) => {
      showToast(error?.data?.message, 'error');
    },
  });
  const handleDelete = async (contributor: any) => {
    const payload = { workflowId, contributorId: contributor?.contributorId, inviteId: contributor?._id };
    await handleTrigger(payload);
  };
  return (
    <div className='w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50 dark:bg-gray-700'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
                Contributor email
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Role</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Status</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
            {isLoading ? (
              <tr>
                <td colSpan={4} className='px-6 py-12 text-center'>
                  <Loader />
                </td>
              </tr>
            ) : (
              contributors.map((contributor) => {
                return (
                  <tr key={contributor._id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors`}>
                    {/* Workflow Name & Info */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0'>
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center ${'bg-blue-100'}`}>
                            <User className={`w-3 h-3 ${'text-blue-600'}`} />
                          </div>
                        </div>
                        <div className='ml-4'>
                          <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                            {contributor.email || contributor?.inviteeEmail}
                          </div>
                          <div className='text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1'>
                            {/* <User className='w-3 h-3 mr-1' /> */}
                            {/* {workflow.createdBy} */}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center'>
                        <div className='text-sm font-medium text-gray-900 dark:text-gray-100'>{contributor.role}</div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center'>
                        <div
                          className={`text-[13px] font-medium text-gray-900 dark:text-gray-100 capitalize px-2 py-0.5 rounded ${getStatus(
                            contributor?.status?.toLowerCase() || 'active',
                          )}`}
                        >
                          {contributor.status || 'Active'}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className='px-6 py-4'>
                      <div className='flex items-center space-x-2'>
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(contributor);
                            }}
                            className='p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors'
                            title='Delete Workflow'
                          >
                            <Trash2 className='w-4 h-4' />
                          </button>
                        </>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!isLoading && contributors.length === 0 && (
        <div className='text-center py-12'>
          <Users className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
          <h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>No contributors found</h3>
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>Start collaborating by adding your first contributor</p>
        </div>
      )}
    </div>
  );
};

export default ContributorsTable;
