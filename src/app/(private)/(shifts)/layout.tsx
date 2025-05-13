'use client';

import SecondaryNavigation from '@/components/secondary-navigation';
import { CalendarClock, MonitorDot } from 'lucide-react';
import { ReactNode } from 'react';

const data = [
  {
    title: 'Shifts',
    url: '/shifts',
    pathname: '/shifts',
    icon: CalendarClock,
  },
  {
    title: 'Active Shifts',
    url: '/active-shifts',
    pathname: '/active-shifts',
    icon: MonitorDot,
  },
];

export default function ShiftsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-4 mx-4 md:mx-6 space-y-10">
      <SecondaryNavigation data={data} />
      {children}
    </div>
  );
}
