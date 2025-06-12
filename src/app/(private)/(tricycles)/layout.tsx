'use client';

import SecondaryNavigation from '@/components/secondary-navigation';
import { CarFront, SquarePlus } from 'lucide-react';
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
];

export default function TricyclesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-4 mx-4 md:mx-6 space-y-10">
      <SecondaryNavigation data={data} />
      {children}
    </div>
  );
}
