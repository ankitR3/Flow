import DisplayApp from "@/src/Components/common/DisplayApp";
import { cn } from "@/lib/utils";
import MainNavbar from "@/src/Components/navbars/MainNavbar";


export default function Home() {
  return (
    <div className="flex justify-center min-h-screen w-full">
      <MainNavbar />
      <div className="h-full max-w-7xl">

        HeroSection
        <DisplayApp />
      </div>
    </div>    
  );
}
