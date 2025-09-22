'use client'

import { FiSearch } from 'react-icons/fi';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className='flex items-stretch w-80 space-x-2'>
            <div className='w-[12%] bg-lime-900/30 flex justify-center items-center rounded-xl'>
                <FiSearch className='text-lime-400 w-4 h-4' />
            </div>

            <Input
                type='text'
                placeholder='Search users...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='bg-zinc-700 text-white text-sm focus:outline-none border border-neutral-900 placeholder:text-zinc-400 flex-1 ring-0 focus:ring-0 focus-visible:ring-0 rounded-xl'
            />
        </div>
    );
}