import { cn } from "@/lib/utils";
import DashboardBase from "@/src/Components/dashboard/DashboardBase";

export default function Dashboard() {
    return (
        <div className={cn("min-h-screen w-full bg-light-base dark:bg-dark-primary select-none")}>
            <DashboardBase />
        </div>
    )
}