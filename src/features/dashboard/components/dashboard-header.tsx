'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/components/ui/logo';
import LogoWithName from '@/components/ui/logo-with-name';
import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  CarFront,
  ChevronDown,
  CircleHelp,
  House,
  SquareChartGantt,
  SquareUser,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getOperator } from '../db/dashboard';
import MobileNavigation from './mobile-navigation';

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

export default function DashboardHeader() {
  const pathname = usePathname();

  const isPathMatch = (substring: string): boolean => {
    return pathname.toLowerCase().includes(substring.toLowerCase());
  };

  const { data: operator } = useQuery({
    queryKey: ['operator'],
    queryFn: getOperator,
  });

  if (!operator) return null;

  return (
    <div className="mx-auto w-full px-4 border-b border-muted-foreground/15 md:px-8 max-w-screen-2xl lg:border-none xl:px-20">
      <div className="flex h-14 md:h-16 items-center justify-between">
        <Link className="transition-all hidden md:block" href="/dashboard">
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
        <div className="flex items-center lg:space-x-2 space-x-1">
          <div className="size-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
            <CircleHelp size={24} />
          </div>
          <div className="size-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
            <Bell size={22} />
          </div>
          <div className="relative">
            <Avatar className="size-10 rounded-full">
              <AvatarImage
                src={operator.image ?? undefined}
                alt={operator.first_name}
              />
              <AvatarFallback className="size-10 border-1 border-white rounded-full bg-gray-300 flex items-center justify-center">
                <p>{operator.first_name.charAt(0).toUpperCase()}</p>
                <p>{operator.last_name.charAt(0).toUpperCase()}</p>
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full flex items-center justify-center bg-card">
              <ChevronDown size={12} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
