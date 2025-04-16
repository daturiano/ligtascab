'use client';

import DashboardHeader from '@/features/dashboard/components/dashboard-header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div className="absolute bg-gradient-to-b from-[#1fab89]/20 to-transparent -z-50 w-full h-64"></div>
        <DashboardHeader />
        <div className="mx-auto pb-10 w-full max-w-screen-2xl px-2.5 lg:px-20 flex flex-col gap-y-3">
          {children}
        </div>
      </div>
    </QueryClientProvider>
  );
}
