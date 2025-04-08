'use client';

import DashboardHeader from '@/features/dashboard/components/dashboard-header';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <DashboardHeader />
      <div className="mx-auto pb-10 mt-10 w-full max-w-screen-xl px-2.5 lg:px-20 flex flex-col gap-y-3">
        {children}
      </div>
    </div>
  );
}
