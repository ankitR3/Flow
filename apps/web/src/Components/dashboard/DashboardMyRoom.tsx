import { Button } from '@/components/ui/button';
import DashboardAllRooms from './DashboardMyRoom/DashboardAllRooms';
import { useMyRoomRendererStore } from '@/src/store/useMyRoomRendererStore';
import { MyRoomRendererEnum } from '@/src/types/MyRoomRendererEnum';
import DashboardJoinRoom from './DashboardMyRoom/DashboardJoinRoom';
import ToolTipComponent from '@/src/utility/ToolTipComponent';

export default function DashboardMyRooms() {
const { value, setValue } = useMyRoomRendererStore();

    function handleMyRoomsOptions() {
        switch(value) {
            case MyRoomRendererEnum.ALL_ROOMS:
                return <DashboardAllRooms />
            case MyRoomRendererEnum.JOIN_ROOM:
                return <DashboardJoinRoom />
        }
    }
    return (
        <div>
            <div>
                <div>
                    <ToolTipComponent content='All available rooms'>
                        <Button
                            variant={'outline'}
                            className='border-none bg-dark text-black dark:text-neutral-200 shadow-none text-[17px]'
                            onClick={() => setValue(MyRoomRendererEnum.ALL_ROOMS)}
                        >
                            All ROOMS
                        </Button>
                    </ToolTipComponent>

                    <ToolTipComponent content='You can join the room'>
                        <Button
                            variant={'outline'}
                            className='border-none bg-dark text-black dark:text-neutral-200 shadow-none text-[17px]'
                            onClick={() => setValue(MyRoomRendererEnum.JOIN_ROOM)}
                        >
                            JOIN ROOM
                        </Button>
                    </ToolTipComponent>
                </div>
                <div className='h-full w-full'>
                    {handleMyRoomsOptions()}
                </div>
            </div>
        </div>
    )
}