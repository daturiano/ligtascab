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
      <div className="min-h-screen min-w-screen max-w-screen mx-auto">
        <div className="absolute bg-gradient-to-b from-[#1fab89]/20 to-transparent -z-50 w-full h-64"></div>
        <div className="lg:max-w-screen-2xl mx-auto">
          <DashboardHeader />
          <div className="flex-1">{children}</div>
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
