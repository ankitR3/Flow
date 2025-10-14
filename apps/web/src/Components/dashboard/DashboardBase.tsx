import DashboardNavbar from "../navbars/DashboardNavbar";
import DashboardLeft from "./DashboardLeft";
import DashboardMid from "./DashboardMid";
import DashboardRight from "./DashboardRight";

export default function DashboardBase() {
    return (
        <div className="w-full h-full max-h-[90%] bg-neutral-200 dark:bg-neutral-900 font-sans text-white dark:text-black">
            <div className="fixed w-full z-[990]">
                <DashboardNavbar />
            </div>
            <div className="mx-auto flex flex-col gap-12">
                <div className="w-full h-screen flex pt-25 pl-6 pr-5 gap-x-6">
                    <DashboardLeft />
                    <DashboardMid />
                    <DashboardRight />
                </div>
            </div>
        </div>
    )
}