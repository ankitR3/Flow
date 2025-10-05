import AppLogo from "@/src/utility/AppLogo";
import DarkModeToggle from "../common/DarkModeToggle";
// import NavbarSignin from "./NavbarSignin";


export default function MainNavbar() {
    return (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 py-4 rounded-full shadow-lg border bg-light-base dark:bg-transparent">
            <div className="px-4 flex items-center justify-between w-full">
                <AppLogo />

                <div className="">
                    <DarkModeToggle />
                </div>
            </div>
        </div>
    )
}