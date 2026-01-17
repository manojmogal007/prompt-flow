import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

interface MiniProgressHeaderProps {
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
    progress: number;
    currentStepName?: string;
}

export const MiniProgressHeader: React.FC<MiniProgressHeaderProps> = ({
    status,
    progress,
    currentStepName
}) => {
    return (
        <div className="absolute top-2 right-2 z-40 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md border border-blue-200 dark:border-blue-900 shadow-lg rounded-full px-6 py-3 flex items-center gap-6 min-w-[400px]">

            {/* Status Icon & Text */}
            <div className="flex items-center gap-2 min-w-fit">
                {status === 'running' && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {status === 'failed' && <AlertCircle className="w-5 h-5 text-red-600" />}

                <span className="font-semibold text-gray-900 dark:text-white capitalize">
                    {status === 'running' ? 'Processing...' : status}
                </span>
            </div>

            {/* Progress Bar & Step Info */}
            <div className="flex-1 flex flex-col justify-center gap-1">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                        {currentStepName && (
                            <>
                                <Zap className="w-3 h-3 text-blue-500" />
                                {currentStepName}
                            </>
                        )}
                    </span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${status === 'failed' ? 'bg-red-500' :
                                status === 'completed' ? 'bg-green-500' :
                                    'bg-blue-600'
                            }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
};
