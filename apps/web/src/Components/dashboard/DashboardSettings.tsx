import { Button } from "@/components/ui/button";
import { useSettingsRendererStore } from "@/src/store/useSettingsActiveStore";
import { SettingsRendererEnum } from "@/src/types/SettingsRendererEnum";
import SettingsChangeTheme from "./DashboardSettings/SettingsChangeTheme";
import SettingsAccountInfo from "./DashboardSettings/SettingsAccountInfo";
import TooltipComponent from "@/src/utility/ToolTipComponent";

export default function DashboardSettings() {
    const { value, setValue } = useSettingsRendererStore();

    function handleDashboardSettingsOption() {
        switch (value) {
            case SettingsRendererEnum.CHANGE_THEME:
                return <SettingsChangeTheme />;
            case SettingsRendererEnum.ACCOUNT_INFO:
                return <SettingsAccountInfo />;
        }
    }

    return (
        <div>
            <div>
                <div>
                    <TooltipComponent content="Choose your preferred theme">
                        <Button
                            variant={"outline"}
                            className="border-none bg-neutral-200 text-black dark:text-white shadow-none text-[17px]"
                            onClick={() => setValue(SettingsRendererEnum.CHANGE_THEME)}
                        >
                            Theme
                        </Button>
                    </TooltipComponent>

                    <TooltipComponent content="View Account details">
                        <Button
                            variant={"outline"}
                            className="border-none bg-neutral-200 text-black dark:text-white shadow-none text-[17px]"
                            onClick={() => setValue(SettingsRendererEnum.ACCOUNT_INFO)}
                        >
                            Account Info
                        </Button>
                    </TooltipComponent>
                </div>
                <div className="h-full w-full">
                    {handleDashboardSettingsOption()}
                </div>
            </div>
        </div>
    )
}