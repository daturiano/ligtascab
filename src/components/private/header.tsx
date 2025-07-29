'use client';

import Logo from '@/components/ui/logo';
import LogoWithName from '@/components/ui/logo-with-name';
import { CarFront, House, SquareChartGantt, SquareUser } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import MobileNavigation from '@/components/private/mobile-navigation';

const SearchBar = dynamic(() => import('./search-bar'), {
  loading: () => (
    <Skeleton className="w-[100px] h-[40px] rounded-4xl py-2 px-4" />
  ),
  ssr: false,
});

const Notifications = dynamic(
  () => import('@/components/private/notification'),
  {
    loading: () => <Skeleton className="size-10 rounded-full" />,
    ssr: false,
  }
);

const UserProfile = dynamic(() => import('@/components/private/user-profile'), {
  loading: () => <Skeleton className="size-10 rounded-full" />,
  ssr: false,
});

export default function DashboardHeader() {
  const pathname = usePathname();

  const isPathMatch = (substring: string): boolean => {
    return pathname.toLowerCase().includes(substring.toLowerCase());
  };

  return (
    <div className="mx-auto w-full px-4 border-b border-muted-foreground/15 md:px-8 lg:border-none">
      <div className="flex h-14 md:h-16 items-center justify-between">
        <Link className="transition-all hidden md:block" href="/home">
          <div className="flex max-w-fit items-center">
            <LogoWithName />
          </div>
        </Link>
        <div className="flex gap-4 md:hidden">
          <MobileNavigation />
          <div className="flex items-center gap-2">
            <Logo />
            <div className="border-r-1 border-muted-foreground/20 h-8"></div>
          </div>
        </div>
        <div className="items-center justify-center gap-8 hidden md:flex">
          {navData.navMain.map((item) => {
            const title =
              item.title.charAt(0).toUpperCase() + item.title.slice(1);
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${
                  isPathMatch(item.pathname)
                    ? 'bg-card px-4 py-2 rounded-4xl shadow-sm'
                    : ''
                }`}
              >
                {
                  <item.icon
                    size={18}
                    className={`${
                      isPathMatch(item.pathname)
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  />
                }
                <p
                  className={`text-sm font-medium ${
                    isPathMatch(item.pathname)
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {title}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center lg:space-x-3 space-x-2">
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
      title: 'Home',
      url: '/home',
      pathname: 'home',
      icon: House,
    },
    {
      title: 'Shift',
      url: '/shifts',
      pathname: 'shift',
      icon: SquareChartGantt,
    },
    {
      title: 'Tricycles',
      url: '/tricycles',
      pathname: 'tricycle',
      icon: CarFront,
    },
    {
      title: 'Drivers',
      url: '/drivers',
      pathname: 'driver',
      icon: SquareUser,
    },
  ],
};
