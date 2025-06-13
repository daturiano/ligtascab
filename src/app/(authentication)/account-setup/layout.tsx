'use client';

import CreateOperatorProvider from '@/features/authentication/components/create-operator-provider';
import OperatorFormProgress from '@/features/authentication/components/operator-form-progress';
import { useMobile } from '@/hooks/useMobile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function CreateOperatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isSmallScreen = useMobile({ max: 960 });
  return (
    <QueryClientProvider client={queryClient}>
      <CreateOperatorProvider>
        <div className="flex flex-col gap-4 mb-24">
          <div className="flex flex-col gap-2">
            <h1 className="lg:text-3xl text-xl font-semibold">
              Create your account
            </h1>
            <p className="text-muted-foreground text-sm lg:text-lg">
              Create a operator information for operational use
            </p>
          </div>
          <div className="flex gap-8 items-start">
            {children}
            {!isSmallScreen && <OperatorFormProgress />}
          </div>
        </div>
      </CreateOperatorProvider>
    </QueryClientProvider>
  );
}
