import SearchBar from "@/src/utility/SearchBar";
import TitleDescription from "@/src/utility/TitleDescription";

export default function DashboardRight() {
    return (
        <div className="h-[90%] w-[18%] flex flex-col justify-between p-4 bg-white dark:bg-neutral-800 font-sans text-white dark:text-black rounded-md">
            <div className='w-full flex justify-end items-center pr-10'>
                <SearchBar />
            </div>
            <div>
                <div className="dark:text-white text-black flex justify-end">
                    <TitleDescription
                        title='Friends'
                        tooltipActive={true}
                        tooltipContent='All your friends are shown here'
                    />
                </div>
            </div>
        </div>
    )
}