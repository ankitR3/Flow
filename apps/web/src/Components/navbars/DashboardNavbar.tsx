import AppLogo from "@/src/utility/AppLogo"
import DarkModeToggle from "../common/DarkModeToggle"

export default function DashboardNavbar() {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-[1600px] px-8 py-4">
            <div className="pr-6 flex items-center justify-between w-full">
                <AppLogo />
                <div className="flex gap-x-3">
                    <DarkModeToggle />
                    NavbarSignin
                </div>
            </div>
        </div>
    )
}