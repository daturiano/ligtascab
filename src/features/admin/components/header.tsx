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
      title: 'Tricycles',
      url: '/admin/tricycles',
      pathname: '/tricycles',
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

const AppHeader = () => {
  const pathname = usePathname();
  const path = pathname.substring(pathname.lastIndexOf('/'));

  return (
    <div className="sticky -top-16 z-20 border-b border-slate-200 bg-slate-50">
      <div className="mx-auto w-full max-w-screen-xl px-2.5 lg:px-20">
        <HeaderTop />
        <div className="flex items-center justify-between">
          <div className="scrollbar-hide relative flex gap-x-2 overflow-x-auto transition-all w-full">
            {data.navMain.map((item) => {
              const title =
                item.title.charAt(0).toUpperCase() + item.title.slice(1);
              return (
                <div key={item.title} className="relative">
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
                    className={`mx-1 my-1.5 rounded-md px-3 py-1.5 transition-all duration-75 ${
                      path.startsWith(item.pathname)
                        ? 'bg-transparent'
                        : 'hover:bg-slate-100 active:bg-slate-200'
                    } group`}
                  >
                    {item.items ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex gap-2 items-center cursor-pointer">
                          <p
                            className={`text-sm ${
                              path.startsWith(item.pathname)
                                ? 'text-black'
                                : 'text-slate-600 hover:text-black group-hover:text-black'
                            }`}
                          >
                            {title}
                          </p>
                          <ChevronDown size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="shadow-none rounded-none bg-gray-50 pr-2">
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
                                {<link.icon size={16} color="#101828" />}
                                <p className="text-xs text-gray-900">
                                  {link.title}
                                </p>
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link href={item.url} className="cursor-pointer">
                        <p
                          className={`text-sm ${
                            path.startsWith(item.pathname)
                              ? 'text-black'
                              : 'text-slate-600 hover:text-black group-hover:text-black'
                          }`}
                        >
                          {title}
                        </p>
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
};

export default AppHeader;
