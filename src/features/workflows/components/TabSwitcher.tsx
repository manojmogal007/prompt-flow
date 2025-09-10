import React from 'react';
import { Users, UserCheck } from 'lucide-react';

type TabType = 'personal' | 'contributions';
interface Props {
  activeTab: string;
  setActiveTab: (tab: TabType) => void;
}

export const TabSwitcher: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabsconfig = [
    {
      label: 'Personal',
      value: 'personal',
      icon: Users,
    },
    {
      label: 'Contributions',
      value: 'contributions',
      icon: UserCheck,
    },
  ];
  return (
    <div className='p-0.5 pb-0.75 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800'>
      <div className='flex space-x-1'>
        {tabsconfig?.map((tab) => (
          <button
            onClick={() => setActiveTab(tab.value as TabType)}
            className={`flex items-center space-x-2 px-4 py-1 rounded-lg font-medium text-sm transition-all duration-200 ${
              activeTab === tab.value
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-gray-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <tab.icon className='w-4 h-4' />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
