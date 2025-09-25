import AppLogo from "@/src/utility/AppLogo";
import DarkModeToggle from "../common/DarkModeToggle";


export default function MainNavbar() {
    return (
        <div>
            <div>
                <AppLogo />
            </div>

            <div>
                <div>
                    <DarkModeToggle />
                    
                </div>
            </div>
        </div>
    )
}