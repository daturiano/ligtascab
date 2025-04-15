import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Logo from '@/components/ui/logo';
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

const data = {
  navMain: [
    {
      title: 'dashboard',
      url: '/dashboard',
      pathname: '/dashboard',
      icon: House,
    },
    {
      title: 'Shift',
      url: '/dashboard/driver-logs',
      pathname: '/driver-logs',
      icon: SquareChartGantt,
    },
    {
      title: 'Tricycles',
      url: '/dashboard/tricycles',
      pathname: '/tricycles',
      icon: CarFront,
    },
    {
      title: 'Drivers',
      url: '/dashboard/drivers',
      pathname: '/drivers',
      icon: SquareUser,
    },
  ],
};

export default function DashboardHeader() {
  const pathname = usePathname();
  const path = pathname.substring(pathname.lastIndexOf('/'));

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-2.5 lg:px-20">
      <div className="flex h-16 items-center justify-between py-10">
        <div className="flex items-center">
          <a className="transition-all sm:block" href="/app">
            <div className="flex max-w-fit items-center gap-2">
              <Logo />
            </div>
          </a>
        </div>
        <div className="flex items-center justify-center gap-8">
          {data.navMain.map((item) => {
            const title =
              item.title.charAt(0).toUpperCase() + item.title.slice(1);
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 ${
                  path.startsWith(item.pathname)
                    ? 'bg-card px-4 py-2 rounded-4xl'
                    : ''
                }`}
              >
                {
                  <item.icon
                    size={18}
                    className={`${
                      path.startsWith(item.pathname)
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  />
                }
                <p
                  className={`text-sm font-medium ${
                    path.startsWith(item.pathname)
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
        <div className="flex items-center space-x-3">
          <div className="size-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
            <CircleHelp size={24} />
          </div>
          <div className="size-10 rounded-full bg-muted-foreground/20 flex items-center justify-center">
            <Bell size={22} />
          </div>
          <div className="relative">
            <Avatar className="size-10 rounded-full">
              {/* <AvatarImage
                // src={user.image ?? undefined}
                // alt={user.first_name ?? undefined}
                /> */}
              <AvatarFallback className="size-10 border-1 border-white rounded-full bg-gray-300 flex items-center justify-center">
                <p>DT</p>
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
