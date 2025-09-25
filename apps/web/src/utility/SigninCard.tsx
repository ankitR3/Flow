import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function SigninCard() {
    async function handleSignin() {
        await signIn('google', {
            redirect: false,
            callbackUrl: '/',
        });
    }

    return (
        <div className="w-full max-w-md p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#161616] shadow-xl space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white">
                    Sign in to continue
                </h2>
            </div>

            <Button
                onClick={handleSignin}
                className="w-full flex items-center justify-center gap-3 px-6 py-[22px] text-sm font-medium bg-neutral-200 hover:bg-neutral-200/70 dark:bg-neutral-800 hover:dark:bg-neutral-700 rounded-md border border-neutral-300 dark:border-neutral-600"
            >
                <Image
                    src="/google.png"
                    height={24}
                    width={24}
                    alt="Google"
                    priority
                    unoptimized
                />
                <span className="text-neutral-900 dark:text-white font-light">Sign in with Google</span>
            </Button>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center leading-relaxed">
                By signing in, you agree to our{" "}
                <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    Privacy Policy
                </span>
                .
            </p>
        </div>
    );
}