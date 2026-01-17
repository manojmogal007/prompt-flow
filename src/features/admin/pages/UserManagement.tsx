import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router';
import { Loader2, Shield, Users, Zap } from 'lucide-react';
import { useGetAllUsersSettingsRequestQuery } from '../../../utils/services/genericService';
import { UserCard } from '../components/UserCard';
import { Pagination } from '../../../utils/helperComponents/Pagination';
import { Searchbar } from '../../../utils/helperComponents/Searchbar';
import { encodeNameAndId } from '../../../utils/helperFunctions/HelperFunctions';
import { useApiQuery } from '../../../utils/customHooks/apiHooks';

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useApiQuery(
    useGetAllUsersSettingsRequestQuery,
    `/settings/getAllSettings?page=${page}&limit=${limit}&search=${search}`,
  );
  const users = data?.settings || [];
  const pagination = data?.pagination;

  const handleSearch = useCallback(
    debounce((text: string) => {
      setSearch(text);
      setPage(1);
    }, 500),
    [],
  );

  const stats = {
    total: pagination?.total || 0,
    pro: users.filter((u: any) => u.plan === 'pro').length,
    blocked: users.filter((u: any) => u.isBlocked).length,
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
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-6'>
          <StatCard title='Total Users' value={stats.total} icon={Users} color='blue' />
          <StatCard title='Pro Plans' value={stats.pro} icon={Zap} color='amber' />
          <StatCard title='Blocked Users' value={stats.blocked} icon={Shield} color='red' />
        </div>
      </div>

      {/* Toolbar */}
      <div className='flex justify-between items-center mb-6'>
        <div className='w-96'>
          <Searchbar
            value={search}
            handleInput={(val: string) => {
              setSearch(val);
              handleSearch(val);
            }}
            placeholder='Search users...'
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className='h-64 flex items-center justify-center'>
          <Loader2 className='animate-spin text-blue-500' size={32} />
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
  color: 'blue' | 'amber' | 'red';
}

const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
    red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
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
