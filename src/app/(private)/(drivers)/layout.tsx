'use client';

import SecondaryNavigation from '@/components/private/secondary-navigation';
import { SquarePlus, Upload, Users } from 'lucide-react';
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
  {
    title: 'Batch Upload',
    url: '/drivers/batch-upload',
    pathname: '/drivers/batch-upload',
    icon: Upload,
  },
];
export default function DriversLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SecondaryNavigation data={data} />
      {children}
    </>
  );
}
