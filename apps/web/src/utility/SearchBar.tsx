'use client'

import { FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className='flex items-stretch w-80 space-x-2'>
            <div className='w-[12%] bg-gray-200 dark:bg-lime-900/30 flex justify-center items-center rounded-xl'>
                <FiSearch className='text-gray-600 dark:text-lime-400 w-4 h-4' />
            </div>

            <Input
                type='text'
                placeholder='Search users...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='flex-1 rounded-xl border
                bg-gray-100 text-gray-900
                dark:bg-zinc-700 dark:text-white
                placeholder:text-gray-500 dark:placeholder:text-zinc-400
                border-gray-300 dark:border-neutral-900
                focus:outline-none focus:ring-0 focus-visible:ring-0'
            />
        </div>
    );
}