import { ReactNode } from "react";
import Navigation from "./_components/navigation";
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-screen min-w-screen overflow-x-hidden bg-white">
      <div className="absolute z-20 h-64 w-full bg-gradient-to-b from-[#1fab89]/20 to-transparent"></div>
      <div className="mx-auto lg:max-w-screen-2xl">
        <Navigation />
        <div className="mx-4 flex-1 space-y-10 pt-4 md:mx-6">{children}</div>
      </div>
    </div>
  );
}
