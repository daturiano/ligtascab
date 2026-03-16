'use client';

import SecondaryNavigation from '@/components/private/secondary-navigation';
import { CarFront, FolderCog, SquarePlus, Upload } from 'lucide-react';
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
  {
    title: 'Batch Upload',
    url: '/tricycles/batch-upload',
    pathname: '/tricycles/batch-upload',
    icon: Upload,
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
