'use client';

import AppHeader from '@/features/admin/components/header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <AppHeader />
        <div className="mx-auto pb-10 mt-10 w-full max-w-screen-xl px-2.5 lg:px-20 flex flex-col gap-y-3">
          {children}
        </div>
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
