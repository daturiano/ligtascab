'use client';

import SecondaryNavigation from '@/components/secondary-navigation';
import { SquarePlus, UserRoundSearch, Users } from 'lucide-react';
import { ReactNode } from 'react';

const data = [
  {
    title: 'Drivers',
    url: '/drivers',
    pathname: 'driver',
    icon: Users,
  },
  {
    title: 'Create Driver',
    url: '/create-driver',
    pathname: '/create-driver',
    icon: SquarePlus,
  },
  {
    title: 'Driver Profile',
    url: '/driver-profile',
    pathname: '/driver-profile',
    icon: UserRoundSearch,
  },
];
export default function DriversLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-4 space-y-10 flex flex-col flex-1">
      <SecondaryNavigation data={data} />
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  );
}
