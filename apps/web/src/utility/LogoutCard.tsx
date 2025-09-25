'use client'

import { signOut } from 'next-auth/react'; 
import { Button } from '@/components/ui/button';
import { FaArrowLeft } from 'react-icons/fa';
import { IoLogOutOutline } from 'react-icons/io5';

interface LogoutCardProps{
    onCancel: () => void;
}

export default function LogoutCard({ onCancel}: LogoutCardProps) {
    async function handleLogout() {
        await signOut({ redirect: true, callbackUrl: '/'});
    }

    return (
        <div className="w-full max-w-[440px] p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#161616] shadow-xl space-y-6">
            <div className="text-center space-y-2 font-sans">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                    Are you sure?
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    You can always sign in again later.
                </p>
            </div>

            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                    <FaArrowLeft size={12} />
                    <span>Go Back</span>
                </Button>
                <Button
                
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium bg-red-600 hover:bg-red-700 dark:bg-red-600/50 dark:hover:bg-red-600/40 text-white rounded-lg transition-colors"
                >
                    <IoLogOutOutline size={18} />
                    <span>Logout</span>
                </Button>

            </div>
        </div>
    )
}