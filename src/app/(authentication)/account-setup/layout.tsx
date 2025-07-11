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
        <div className="w-full px-4 mt-10">
          <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-4 mb-24">
            <div className="flex flex-col gap-2">
              <h1 className="lg:text-2xl xl:text-3xl text-xl font-semibold">
                Create your account
              </h1>
              <p className="text-muted-foreground text-sm lg:text-lg xl:text-xl">
                Create a operator information for operational use
              </p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="flex-1">{children}</div>
              {!isSmallScreen && <OperatorFormProgress />}
            </div>
          </div>
        </div>
      </CreateOperatorProvider>
    </QueryClientProvider>
  );
}
