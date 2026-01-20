import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router';
import { Shield, Users, Zap, SearchX } from 'lucide-react';
import { useGetAllUsersSettingsRequestQuery, useGetGlobalUserStatisticsRequestQuery } from '../../../utils/services/genericService';
import { UserCard } from '../components/UserCard';
import { Pagination } from '../../../utils/helperComponents/Pagination';
import { Searchbar } from '../../../utils/helperComponents/Searchbar';
import { encodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import { useApiQuery } from '../../../utils/customHooks/apiHooks';
import CardLoader from '../../../utils/helperComponents/CardLoader';

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState('');
  const [tempSearch, setTempSearch] = useState<string>('');

  const { data, isLoading } = useApiQuery(
    useGetAllUsersSettingsRequestQuery,
    `/settings/getAllSettings?page=${page}&limit=${limit}&search=${search}`,
  );
  const { data: statsData } = useApiQuery(useGetGlobalUserStatisticsRequestQuery, '/settings/getGlobalUserStatistics');
  const users = data?.settings || [];
  const pagination = data?.pagination;

  const handleSearch = useCallback(
    debounce((text: string) => {
      setSearch(text);
      setPage(1);
    }, 500),
    [],
  );

  const stats = statsData?.stats || {
    totalUsers: 0,
    blockedUsers: 0,
    proUsers: 0,
    unlimitedUsers: 0,
    freeUsers: 0,
    enterpriseUsers: 0,
    admins: 0,
    superAdmins: 0,
  };

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-dark-900 p-8'>
      {/* Header & Stats */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3'>
          <Shield className='text-blue-500 fill-blue-500/20' />
          User Management
        </h1>
        <p className='text-gray-500 dark:text-gray-400'>Manage user access, plans, and resource limits.</p>

        {/* Stats Row */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6'>
          <StatCard title='Total Users' value={stats.totalUsers || 0} icon={Users} color='blue' />
          <StatCard title='Pro Plans' value={stats.proUsers || 0} icon={Zap} color='amber' />
          <StatCard title='Enterprise Plans' value={stats.enterpriseUsers || 0} icon={Zap} color='purple' />
          <StatCard title='Unlimited Plans' value={stats.unlimitedUsers || 0} icon={Zap} color='teal' />
          <StatCard title='Free Plans' value={stats.freeUsers || 0} icon={Zap} color='gray' />
          <StatCard title='Blocked Users' value={stats.blockedUsers || 0} icon={Shield} color='red' />
          <StatCard title='Admins' value={stats.admins || 0} icon={Shield} color='indigo' />
          <StatCard title='Super Admins' value={stats.superAdmins || 0} icon={Shield} color='rose' />
        </div>
      </div>

      {/* Toolbar */}
      <div className='flex justify-between items-center mb-6'>
        <div className='w-96'>
          <Searchbar
            value={tempSearch}
            handleInput={(val: string) => {
              setTempSearch(val);
              handleSearch(val);
            }}
            placeholder='Search users...'
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {Array.from({ length: 8 }).map((_, index) => (
            <CardLoader key={index} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 bg-white dark:bg-dark-800 rounded-2xl border border-gray-100 dark:border-dark-700 shadow-sm'>
          <div className='p-4 bg-gray-50 dark:bg-dark-900 rounded-full mb-4'>
            <SearchX className='w-12 h-12 text-gray-400 dark:text-gray-500' />
          </div>
          <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>No users found</h3>
          <p className='text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6'>
            We couldn't find any users matching your search. Try adjusting your filters or search terms.
          </p>
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setTempSearch('');
              }}
              className='px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm font-medium transition-colors'
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {users.map((item: any) => (
              <UserCard
                key={item._id}
                user={item}
                onClick={() => navigate(`/prompt-flow/admin/user/${encodeNameAndId(item?.user?.firstName, item?.userId)}`)}
              />
            ))}
          </div>

          <div className='mt-8'>
            <Pagination
              currentPage={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={setPage}
              pageSize={limit}
              totalItems={pagination?.total || 0}
            />
          </div>
        </>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: 'blue' | 'amber' | 'red' | 'purple' | 'teal' | 'gray' | 'indigo' | 'rose';
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    teal: 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400',
    gray: 'bg-gray-50 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400',
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
  };

  return (
    <div className='bg-white dark:bg-dark-800 rounded-xl p-4 border border-gray-100 dark:border-dark-700 shadow-sm flex items-center justify-between'>
      <div>
        <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>{title}</p>
        <p className='text-2xl font-bold text-gray-900 dark:text-white mt-1'>{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        <Icon size={20} />
      </div>
    </div>
  );
};
