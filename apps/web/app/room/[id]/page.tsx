'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import RoomDisplayCard from '@/src/utility/RoomDisplayCard';

export default function RoomPage() {
  const { id } = useParams();

  useEffect(() => {
    console.log('Joined room:', id);
  }, [id]);

  if (!id) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-2xl mb-4">Welcome to Room {id}</h1>
      <RoomDisplayCard roomId={id as string} />
    </div>
  );
}
