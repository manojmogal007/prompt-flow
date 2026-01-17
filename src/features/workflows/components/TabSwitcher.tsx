import React from 'react';
import { Users, User } from 'lucide-react';
import { motion } from 'framer-motion';

type TabType = 'personal' | 'community';
interface Props {
  activeTab: string;
  setActiveTab: (tab: TabType) => void;
}

export const TabSwitcher: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const tabsconfig = [
    {
      label: 'Personal',
      value: 'personal',
      icon: User,
    },
    {
      label: 'Community',
      value: 'community',
      icon: Users,
    },
  ];

  return (
    <div className='relative inline-flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner'>
      {tabsconfig.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as TabType)}
            className={`
              relative z-10 flex items-center space-x-2 px-5 py-2 rounded-lg 
              font-medium text-sm transition-colors duration-200 outline-none
              ${isActive
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            <tab.icon className={`w-4 h-4 relative z-10 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            <span className="relative z-10">{tab.label}</span>

            {isActive && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-black/5 dark:border-white/5"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
