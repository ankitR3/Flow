'use client'

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import { useUserSessionStore } from "@/src/store/useUserSessionStore";
import SigninModal from "@/src/utility/SigninModel";
import RightAnimatedList from "./RightAnimatedList";
import { useTheme } from "next-themes";

export default function DisplayApp() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonRef = useRef(null);
    const draggableRef = useRef(null);
    const router = useRouter();
    const { session } = useUserSessionStore();
    const [opensignInModal, setOpenSignInModal] = useState<boolean>(false);
    const { theme } = useTheme();

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
                opacity: 0,
                y: 50
            });
            gsap.set(draggableRef.current, {
                opacity: 0,
                x: 100,
                scale: 0.8
            });

            const tl = gsap.timeline({ delay: 0.2});

            tl.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out"
            })
                .to(subtitleRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.6")
                .to(buttonRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                    clearProps: "transform"
                }, "-=0.4")
                .to(draggableRef.current, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.5");

            gsap.to(".cyan-text", {
                y: -3,
                duration: 2,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    function handleGetStarted() {
        if (!session?.user?.token) {
            setOpenSignInModal(true);
        } else {
            router.push("/dashboard")
        }
    }

    return (
        <div ref={containerRef} className="w-full min-h-[415px] rounded-3xl overflow-visible relative">
            <div className="w-full h-full flex p-4 gap-x-3">
                <div className="w-[70%] h-full flex flex-col rounded-3xl p-4 relative overflow-hidden">
                    <span ref={titleRef} className={`text-[80px] font-mono leading-24 ${theme == "dark" ? "text-white" : "text-neutral-900"} py-14`}>
                        The Flow Of <span className="text-cyan-700 dark:text-red-500/70 cyan-text">CONVERSATION</span>
                    </span>
                    <span ref={subtitleRef} className="text-[23px] text-zinc-600 dark:text-zinc-400 font-mono block mt-1.5">
                        Great conversations don't just happen — they flow.
                    </span>

                    <div className="mt-10">
                        <Button
                            onClick={handleGetStarted}
                            ref={buttonRef}
                            variant={"default"}
                            className="text-[18px] dark:bg-white bg-black font-sans text-white dark:text-black  hover:-translate-y-0.5 transition-all transform duration-200">
                            Get Started <span className="text-sm">{"->"}</span>
                        </Button>
                    </div>
                </div>
                {/* <div ref={draggableRef} className="w-[30%] h-full border border-zinc-600 dark:border-zinc-800/50 rounded-3xl p-2 space-y-3 py-12">
                    <RightAnimatedList />
                </div> */}
            </div>

            <SigninModal
                openSigninModal={opensignInModal}
                setOpenSigninModal={setOpenSignInModal}
            />
        </div>
    );
}