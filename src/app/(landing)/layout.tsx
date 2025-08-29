import { ReactNode } from "react";
import Navigation from "./_components/navigation";
export default function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full overflow-x-hidden bg-white">
      <div className="absolute z-50 h-64 w-full bg-gradient-to-b from-[#1fab89]/20 to-transparent"></div>
      <div>
        <Navigation />
        <div className="mx-4 flex-1 space-y-10 pt-4 md:mx-6">{children}</div>
      </div>
    </div>
  );
}
