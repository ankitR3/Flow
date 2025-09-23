import RoomDisplayCard from '@/src/utility/RoomDisplayCard';

export default function DashboardMyRooms() {
    return (
        <div className='w-full h-full space-x-10 flex justify-start items-start pt-2 px-6'>
            <div className='w-full max-w-as pr-4 px-2'>
                <RoomDisplayCard />
            </div>

            <div className='w-full pr-2 px-2'>
                hi
            </div>
        </div>
    )
}