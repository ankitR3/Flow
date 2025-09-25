'use client'

import { useUserSessionStore } from "@/src/store/useUserSessionStore";
import { useRouter } from "next/router";
import { useState } from "react"
import NavbarNameDisplay from "./NavbarNameDisplay";
import TooltipComponent from "@/src/utility/ToolTipComponent";
import { Button } from "@/components/ui/button";
import SigninModal from "@/src/utility/SigninModel";



export default function NavbarSignin() {
    const [openSigninModal, setOpenSigninModal] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const router = useRouter();

    function handleSignin() {
        if (!session?.user?.token) {
            setOpenSigninModal(true);
        } else {
            router.push('/dashboard');
        }
    }

    const isSignedIn = !!session?.user?.id;

    return (
        <div>
            {isSignedIn ? (
                <NavbarNameDisplay />
            ) : (
                <TooltipComponent content='Sign In to continue'>
                    <Button
                        onClick={handleSignin}
                        className="hover:-translate-y-0.5 tracking-wide font-sans font-light transition-all transform-3d duration-200"
                    >
                        Sign In
                    </Button>
                </TooltipComponent>
            )}
            <SigninModal
                openSigninModal={openSigninModal}
                setOpenSigninModal={setOpenSigninModal}
            />
        </div>
    )
}