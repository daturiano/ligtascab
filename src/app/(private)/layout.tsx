'use client';

import DashboardHeader from '@/features/dashboard/components/dashboard-header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <div className="absolute bg-gradient-to-b from-[#1fab89]/20 to-transparent -z-50 w-full h-64"></div>
        <DashboardHeader />
        <div className="mx-auto w-full flex flex-col flex-1 gap-y-3">
          {children}
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
