import Image from 'next/image';
import { Session } from 'next-auth';
import { useState } from 'react';
import { AtSign, Check, Mail, Pencil, User, X } from 'lucide-react';
import TooltipComponent from './ToolTipComponent';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FiLogOut } from 'react-icons/fi';
import LogoutModel from './LogoutModel';

interface UserInfoDisplayProps {
    session: Session | null;
    username: string;
    newUsername: string;
    setNewUsername: (value: string) => void;
    editing: boolean;
    setEditing: (value: boolean) => void;
    loading: boolean;
    handleUpdateUsername: () => void;
    handleCancelEdit: () => void;
}

export default function UserInfoDisplay({
    session,
    username,
    newUsername,
    setNewUsername,
    editing,
    setEditing,
    loading,
    handleUpdateUsername,
    handleCancelEdit,
}: UserInfoDisplayProps) {
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

    function handleLogout() {
        setShowLogoutModal(true)
    }

    return (
        <div className='w-full max-w-2xl mx-auto'>
            <div className='bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-8'>
                <div className='flex items-start gap-6 mb-8 pb-6 border-b border-[#1a1a1a]'>
                    <div className='relative h-16 w-16 rounded-xl overflow-hidden bg-[#111111] border border-[#b8e741da]/20 shrink-0'>
                        {session?.user?.image ? (
                            <Image
                                src={session.user.image}
                                alt='User Avatar'
                                fill
                                className='object-cover'
                                unoptimized
                            />
                        ) : (
                            <div className='h-full w-full flex items-center justify-center'>
                                <User className='h-6 w-6 text-[#b8e741da]' />
                            </div>
                        )}
                    </div>

                    <div className='flex-1 min-w-0'>
                        <h2 className='text-lg font-medium text-white mb-1 truncate'>
                            {session?.user?.email}
                        </h2>
                        <p className='text-sm text-[#666666] truncate'>
                            {session?.user?.email}
                        </p>
                    </div>
                </div>

                <div className='space-y-6'>
                    <div>
                        <div className='flex items-center justify-between mb-3 pl-1'>
                            <div className='flex items-center gap-2'>
                                <AtSign className='text-sm text-[#999999] font-medium' />
                                <label>
                                    Username
                                </label>
                            </div>
                            {!editing && (
                                <TooltipComponent content='Edit username'>
                                    <button
                                        onClick={() => setEditing(true)}
                                        className='p-1.5 rounded-lg hover:bg-[#1a1a1a] text-[#666666] hover:text-[#b8e741da] transition-colors'
                                    >
                                        <Pencil className='h-3.5 w-3.5' />
                                    </button>
                                </TooltipComponent>
                            )}
                        </div>

                        {!editing ? (
                            <div className='h-11 px-4 flex items-center bg-[#111111] border border-[#1a1a1a] rounded-lg'>
                                <span className='text-white text-sm'>
                                    {username ? `@${username}` : (
                                        <span className='text-[#666666]'>Not set</span>
                                    )}
                                </span>
                            </div>
                        ) : (
                            <div className='flex gap-2'>
                                <div className='relative flex-1'>
                                    <span className='absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] text-sm pointer-events-none'>@</span>
                                    <Input
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        placeholder='username'
                                        className='h-11 pl-8 bg-[#111111] border-[#1a1a1a] text-white placeholder:text-[#666666] focus:border-[#b8e741da] focus:ring-0 rounded-lg'
                                        autoFocus
                                    />
                                </div>

                                <Button
                                    type='button'
                                    size='sm'
                                    onClick={handleUpdateUsername}
                                    disabled={loading || newUsername === username || !newUsername.trim()}
                                    className='h-10 px-6 bg-[#b8e741da] hover:bg-[#b8e741da]/90 text-black font-medium rounded-lg disabled:opacity-50'
                                >
                                    <Check className='h-3.5 w-3.5' />
                                </Button>

                                <Button
                                    type='button'
                                    size='sm'
                                    variant='ghost'
                                    onClick={handleCancelEdit}
                                    className='h-11 px-4 hover:bg-[#1a1a1a] text-[#666666] hover:text-white rounded-lg'
                                >
                                    <X className='h-3.5 w-3.5' />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className='flex items-center gap-2 mb-3 pl-1'>
                            <User className='h-4 w-4 text-[#b8e741da]' />
                            <label className='text-sm text-[#999999] font-medium'>
                                Name
                            </label>
                        </div>
                        <div className='h-11 px-4 flex items-center bg-[#111111] border border-[#1a1a1a] rounded-lg'>
                            <span className='text-white text-sm'>
                                {session?.user?.name || (
                                    <span>Not provided</span>
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <div className='flex items-center gap-2 mb-3 pl-1'>
                            <Mail className='h-4 w-4 text-[#b8e741da]' />
                            <label className='text-sm text-[#999999] font-medium'>
                                Email Address
                            </label>
                        </div>
                        <div className='h-11 px-4 flex items-center bg-[#111111] border border-[#1a1a1a] rounded-lg'>
                            <span className='text-white text-sm'>
                                {session?.user?.email || (
                                    <span className='text-[#666666]'>Not provided</span>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className='w-full flex justify-center pt-4'>
                        <Button
                            className='flex font-mono items-center justify-center dark:bg-red-500/50 dark:hover:bg-red-900/80 dark:text-black px-5 py-5'
                            onClick={handleLogout}
                        >
                            <FiLogOut className='w-4 h-4' />
                            <span>Logout</span>
                        </Button>
                    </div>
                </div>
            </div>
            {showLogoutModal && (
                <LogoutModel
                    openLogoutModel={showLogoutModal}
                    setOpenLogoutModel={setShowLogoutModal}
                />
            )}
        </div>
    );
}