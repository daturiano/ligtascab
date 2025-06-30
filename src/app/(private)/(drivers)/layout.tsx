'use client';

import SecondaryNavigation from '@/components/secondary-navigation';
import { SquarePlus, Users } from 'lucide-react';
import { ReactNode } from 'react';

const data = [
  {
    title: 'Drivers',
    url: '/drivers',
    pathname: '/driver',
    icon: Users,
  },
  {
    title: 'Create Driver',
    url: '/create-driver',
    pathname: '/create-driver',
    icon: SquarePlus,
  },
];
export default function DriversLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-4 mx-4 md:mx-6 space-y-10">
      <SecondaryNavigation data={data} />
      {children}
    </div>
  );
}
