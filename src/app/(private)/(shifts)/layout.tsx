'use client';

import SecondaryNavigation from '@/components/secondary-navigation';
import { CalendarClock } from 'lucide-react';
import { ReactNode } from 'react';

const data = [
  {
    title: 'Shifts',
    url: '/shifts',
    pathname: '/shifts',
    icon: CalendarClock,
  },
];

export default function ShiftsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SecondaryNavigation data={data} />
      {children}
    </>
  );
}
