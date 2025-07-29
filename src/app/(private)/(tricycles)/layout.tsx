'use client';

import SecondaryNavigation from '@/components/private/secondary-navigation';
import { CarFront, FolderCog, SquarePlus } from 'lucide-react';
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
    title: 'Maintenance Records',
    url: '/tricycle-maintenance',
    pathname: '/tricycle-maintenance',
    icon: FolderCog,
  },
];

export default function TricyclesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SecondaryNavigation data={data} />
      {children}
    </>
  );
}
