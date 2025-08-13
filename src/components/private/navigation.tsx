"use client";

import Logo from "@/components/ui/logo";
import LogoWithName from "@/components/ui/logo-with-name";
import { CarFront, House, SquareChartGantt, SquareUser } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import MobileNavigation from "@/components/private/mobile-navigation";

const SearchBar = dynamic(() => import("@/components/private/search-bar"), {
  loading: () => (
    <Skeleton className="h-[40px] w-[100px] rounded-4xl px-4 py-2" />
  ),
  ssr: false,
});

const Notifications = dynamic(
  () => import("@/components/private/notification"),
  {
    loading: () => <Skeleton className="size-10 rounded-full" />,
    ssr: false,
  },
);

const UserProfile = dynamic(() => import("@/components/private/user-profile"), {
  loading: () => <Skeleton className="size-10 rounded-full" />,
  ssr: false,
});

export default function Navigation() {
  const pathname = usePathname();

  const isPathMatch = (substring: string): boolean => {
    return pathname.toLowerCase().includes(substring.toLowerCase());
  };

  return (
    <div className="border-muted-foreground/15 mx-auto w-full border-b px-4 md:px-8 lg:border-none">
      <div className="flex h-14 items-center justify-between md:h-16">
        <div className="hidden transition-all md:block">
          <div className="flex max-w-fit items-center">
            <LogoWithName />
          </div>
        </div>
        <div className="flex gap-4 md:hidden">
          <MobileNavigation />
          <div className="flex items-center gap-2">
            <Logo />
            <div className="border-muted-foreground/20 h-8 border-r-1"></div>
          </div>
        </div>
        <div className="hidden items-center justify-center gap-8 md:flex">
          {navData.navMain.map((item) => {
            const title =
              item.title.charAt(0).toUpperCase() + item.title.slice(1);
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap ${
                  isPathMatch(item.pathname)
                    ? "bg-card rounded-4xl px-4 py-2 shadow-sm"
                    : ""
                }`}
              >
                {
                  <item.icon
                    size={20}
                    className={`${
                      isPathMatch(item.pathname)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  />
                }
                <p
                  className={`text-sm font-medium ${
                    isPathMatch(item.pathname)
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {title}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center space-x-2 lg:space-x-3">
          <SearchBar />
          <Notifications />
          <UserProfile />
        </div>
      </div>
    </div>
  );
}

export const navData = {
  navMain: [
    {
      title: "Home",
      url: "/home",
      pathname: "home",
      icon: House,
    },
    {
      title: "Shift",
      url: "/shifts",
      pathname: "shift",
      icon: SquareChartGantt,
    },
    {
      title: "Tricycles",
      url: "/tricycles",
      pathname: "tricycle",
      icon: CarFront,
    },
    {
      title: "Drivers",
      url: "/drivers",
      pathname: "driver",
      icon: SquareUser,
    },
  ],
};
