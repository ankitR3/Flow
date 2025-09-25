'use client'

import { useUserSessionStore } from '@/src/store/useUserSessionStore'
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import HeadingCard from '../dashboard/HeadingCard';
import { BiLogOut } from 'react-icons/bi';
import LogoutModel from '@/src/utility/LogoutModel';


export default function NavbarNameDisplay() {
    const { session } = useUserSessionStore();
    const [panel, setPanel] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!panelRef.current) {
            return;
        }

        if (panel) {
            gsap.fromTo(
                panelRef.current,
                { opacity: 0, y: -10, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)",
                }
            );
        }
    }, [panel]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef. current && !containerRef.current.contains(event.target as Node)) {
                setPanel(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogoutClick = () => {
        setPanel(false);
        setShowLogoutModal(true);
    };

    if (!session || !session.user) {
        return null;
    }

    return (
        <>
            <div
                ref={containerRef}
                className="relative h-full flex items-center justify-end cursor-pointer select-none"
            >
                <div
                    onClick={() => setPanel((prev) => !prev)}
                    className='flex items-center gap-2 px-3 space-x-3 py-1 rounded-full transition'
                >
                    <HeadingCard />

                    {session.user.image && (
                        <span className='h-8 w-8 rounded-full border overflow-hidden relative'>
                            <Image
                                src={session.user.image}
                                alt="User Avatar"
                                fill
                                className="object-cover rounded-full"
                            />
                        </span>
                    )}
                </div>

                {panel && (
                    <div
                        ref={panelRef}
                        className='absolute top-10 right-2 mt-2 z-50 w-[140px] bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-700 rounded-[10px] shadow-xl overflow-hidden'
                    >
                        <button
                            onClick={handleLogoutClick}
                            className='w-full flex items-center gap-2 px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-[#141414] dark:hover:text-red-400/90 rounded-md transition-colors duration-200'
                        >
                            <BiLogOut size={16} />
                            Logout
                        </button>
                    </div>
                )}
            </div>

            {showLogoutModal && (
                <LogoutModel
                    openLogoutModel={showLogoutModal}
                    setOpenLogoutModel={setShowLogoutModal}
                />
            )}
        </>
    )
}