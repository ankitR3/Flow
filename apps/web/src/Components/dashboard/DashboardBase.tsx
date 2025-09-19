
export default function DashboardBase() {
    return (
        <div className="w-full h-full max-h-[90%] bg-neutral-200">
            <div className="fixed w-full z.[990]">
                Dashboard Navbar
            </div>
            <div className="mx-auto max-w-[1700px] px-4 flex flex-col gap-12">
                <div className="w-full h-screen flex pt-25">
                    Dashboard Left
                    Dashboard Right
                </div>
            </div>
        </div>
    )
}