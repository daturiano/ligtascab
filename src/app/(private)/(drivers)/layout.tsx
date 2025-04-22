'use client';

import DriverNavigation from '@/features/drivers/components/driver-navigation';
import { ReactNode } from 'react';

export default function DriversLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-4 space-y-10 flex flex-col flex-1">
      <DriverNavigation />
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  );
}
