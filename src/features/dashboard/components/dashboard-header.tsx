'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Car,
  ChevronDown,
  CirclePlus,
  Table,
  UserRoundPlus,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HeaderTop from './header-top';

const data = {
  navMain: [
    {
      title: 'dashboard',
      url: '/dashboard',
      pathname: '/dashboard',
    },
    {
      title: 'Driver Shift Logs',
      url: '/dashboard/driver-logs',
      pathname: '/driver-logs',
    },
    {
      title: 'Vehicles',
      url: '/dashboard/vehicles',
      pathname: '/vehicles',
      icon: Car,
      items: [
        {
          title: 'View Vehicles',
          url: '/dashboard/vehicles',
          icon: Table,
        },
        {
          title: 'Create A Vehicle',
          url: '/dashboard/vehicles/create-vehicle',
          icon: CirclePlus,
        },
      ],
    },
    {
      title: 'Drivers',
      url: '/dashboard/drivers',
      pathname: '/drivers',
      items: [
        {
          title: 'View Drivers',
          url: '/dashboard/drivers',
          icon: Table,
        },
        {
          title: 'Create A Driver',
          url: '/dashboard/vehicles/create-vehicle',
          icon: UserRoundPlus,
        },
      ],
    },
  ],
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const path = pathname.substring(pathname.lastIndexOf('/'));

  return (
    <div className="sticky -top-16 z-20 border-b">
      <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
        <HeaderTop />
        <div className="flex items-center justify-between">
          <div className="relative flex gap-x-2 overflow-x-auto transition-all">
            {data.navMain.map((item) => {
              const title =
                item.title.charAt(0).toUpperCase() + item.title.slice(1);
              return (
                <div key={item.title}>
                  {path.startsWith(item.pathname) && (
                    <div
                      className="absolute bottom-0 w-full px-3"
                      style={{
                        transform: 'none',
                        transformOrigin: '50% 50% 0px',
                      }}
                    >
                      <div className="h-0.5 bg-black"></div>
                    </div>
                  )}
                  <div
                    className={`mx-1 my-1.5 rounded-md px-3 py-1.5 transition-all duration-75`}
                  >
                    {item.items ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex gap-2 items-center cursor-pointer">
                          <p className={`text-sm`}>{title}</p>
                          <ChevronDown size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="shadow-none rounded-none pr-2">
                          {item.items.map((link) => (
                            <DropdownMenuItem
                              key={link.title}
                              asChild
                              className="cursor-pointer"
                            >
                              <Link
                                href={link.url}
                                className="flex items-center gap-2"
                              >
                                {<link.icon size={16} color="#ffffff" />}
                                <p className="text-xs">{link.title}</p>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link
                        href={item.url}
                        className="cursor-pointer whitespace-nowrap"
                      >
                        <p className={`text-sm`}>{title}</p>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
