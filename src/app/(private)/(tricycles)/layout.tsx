'use client';

import SecondaryNavigation from '@/components/secondary-navigation';
import { CarFront, FilePlus2, SquarePlus } from 'lucide-react';
import { ReactNode } from 'react';

const data = [
  {
    title: 'Tricycles',
    url: '/tricycles',
    pathname: '/tricycles',
    icon: CarFront,
  },
  {
    title: 'Create Tricycle',
    url: '/create-tricycle',
    pathname: '/create-tricycle',
    icon: SquarePlus,
  },
  {
    title: 'Renew Tricycle',
    url: '/renew-tricycle',
    pathname: '/renew-tricycle',
    icon: FilePlus2,
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
