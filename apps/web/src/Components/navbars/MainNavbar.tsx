import AppLogo from "@/src/utility/AppLogo";
import DarkModeToggle from "../common/DarkModeToggle";
// import NavbarSignin from "./NavbarSignin";


export default function MainNavbar() {
    return (
        <div className="">
            <div className="">
                <AppLogo />

                <div className="">
                    <DarkModeToggle />
                    {/* <NavbarSignin /> */}
                </div>
            </div>
        </div>
    )
}