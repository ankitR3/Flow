"use client"
import DisplayApp from "@/src/Components/common/DisplayApp";
import { cn } from "@/lib/utils";
import MainNavbar from "@/src/Components/navbars/MainNavbar";
import { useTheme } from "next-themes";

export default function Home() {
  const {theme} = useTheme();
  return (
    <div className={`flex justify-center min-h-screen w-full ${theme == "dark" ? "" : "bg-neutral-200"}`}>
      <MainNavbar />
      <div className="h-full max-w-7xl">

        HeroSection
        <DisplayApp />
      </div>
    </div>    
  );
}
