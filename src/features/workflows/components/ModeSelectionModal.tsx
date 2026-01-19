import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Globe, Laptop, X, Shield, Zap } from 'lucide-react';
import { useSettings } from '../../../hooks/useSettings';
import { Infobar } from '../../../utils/helperComponents/Infobar';
import { useApiMutation } from '../../../utils/customHooks/apiHooks';
import { usePostLiveRoomsUsageMutation } from '../../../utils/services/genericService';
import { useAuth } from '../../../auth/useAuth';

interface ModeSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (mode: 'local' | 'collab') => void;
}

export const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({ isOpen, onClose, onSelect }) => {
    const { isLiveRoomLimitReached, refetchSettings } = useSettings();
    const {
        user: { id },
    } = useAuth();

    const { handleTrigger } = useApiMutation(usePostLiveRoomsUsageMutation, `/settings/updateLiveRoomsUsage?userId=${id}`, {
        onSuccess: () => {
            refetchSettings();
        },
    });

    const handleCollabMode = async () => {
        onSelect('collab');
        await handleTrigger({});
    };
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]'
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className='fixed inset-0 flex items-center justify-center z-[70] p-4'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='bg-white dark:bg-dark-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-dark-700'>
                            {/* Header */}
                            <div className='relative p-8 text-center border-b border-slate-100 dark:border-dark-700/50'>
                                <button
                                    onClick={onClose}
                                    className='absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors'
                                >
                                    <X className='w-5 h-5' />
                                </button>
                                <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-2'>Choose Your Workspace</h2>
                                <p className='text-slate-500 dark:text-slate-400'>Select how you want to work on this flow today</p>
                            </div>

                            {isLiveRoomLimitReached && (
                                <div className='px-8 bg-slate-50 dark:bg-dark-900/50 pt-4'>
                                    <Infobar
                                        title={'Live Room Limit Reached'}
                                        type={'warning'}
                                        description={'You’ve reached the maximum number of live rooms. Upgrade your plan to create more.'}
                                    />
                                </div>
                            )}

                            {/* Options */}
                            <div className='grid md:grid-cols-2 gap-4 p-8 bg-slate-50 dark:bg-dark-900/50'>
                                {/* Local Mode Card */}
                                <button
                                    onClick={() => onSelect('local')}
                                    className='group relative flex flex-col p-6 rounded-2xl border-2 border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 text-left hover:shadow-xl hover:-translate-y-1'
                                >
                                    <div className='absolute top-4 right-4 text-slate-300 dark:text-dark-600 group-hover:text-blue-500 transition-colors'>
                                        <Laptop className='w-6 h-6' />
                                    </div>
                                    <div className='w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                                        <Shield className='w-6 h-6 text-blue-600 dark:text-blue-400' />
                                    </div>
                                    <h3 className='text-lg font-bold text-slate-900 dark:text-white mb-2'>Run Locally</h3>
                                    <p className='text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1'>
                                        Private workspace. Perfect for testing, debugging, and single-player editing. No internet sync required.
                                    </p>
                                    <div className='flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-full w-fit'>
                                        <Zap className='w-3 h-3' />
                                        Fast & Private
                                    </div>
                                </button>

                                {/* Collaborative Mode Card */}
                                <button
                                    disabled={isLiveRoomLimitReached}
                                    onClick={handleCollabMode}
                                    className={`group relative flex flex-col p-6 rounded-2xl border-2 border-slate-200 dark:border-dark-700 bg-white dark:bg-dark-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-300 text-left hover:shadow-xl hover:-translate-y-1 ${isLiveRoomLimitReached ? 'opacity-50 pointer-events-none cursor-not-allowed ' : ''
                                        }`}
                                >
                                    <div className='absolute top-4 right-4 text-slate-300 dark:text-dark-600 group-hover:text-indigo-500 transition-colors'>
                                        <Globe className='w-6 h-6' />
                                    </div>
                                    <div className='w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                                        <Users className='w-6 h-6 text-indigo-600 dark:text-indigo-400' />
                                    </div>
                                    <h3 className='text-lg font-bold text-slate-900 dark:text-white mb-2'>Real-time Collab</h3>
                                    <p className='text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1'>
                                        Work together with your team. Live cursors, instant updates, and shared execution state.
                                    </p>
                                    <div className='flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full w-fit'>
                                        <span className='relative flex h-2 w-2'>
                                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75'></span>
                                            <span className='relative inline-flex rounded-full h-2 w-2 bg-indigo-500'></span>
                                        </span>
                                        Live Syncing
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
