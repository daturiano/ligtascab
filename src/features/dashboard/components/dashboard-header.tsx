'use client';

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
      title: 'Shift',
      url: '/dashboard/driver-logs',
      pathname: '/driver-logs',
    },
    {
      title: 'Tricycles',
      url: '/dashboard/tricycles',
      pathname: '/tricycles',
    },
    {
      title: 'Drivers',
      url: '/dashboard/drivers',
      pathname: '/drivers',
    },
  ],
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const path = pathname.substring(pathname.lastIndexOf('/'));

  return (
    <div className="sticky -top-16 z-20 border-b">
      <div className="mx-auto w-full max-w-screen-2xl px-2.5 lg:px-20">
        <HeaderTop />
        <div className="flex items-center justify-between">
          <div className="relative flex gap-x-2 overflow-x-auto transition-all">
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
                      <div className="h-[3px] bg-primary"></div>
                    </div>
                  )}
                  <div
                    className={`mx-1 my-1.5 rounded-md px-3 py-1.5 transition-all duration-75`}
                  >
                    <Link
                      href={item.url}
                      className="cursor-pointer whitespace-nowrap"
                    >
                      <p className={`text-sm`}>{title}</p>
                    </Link>
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
