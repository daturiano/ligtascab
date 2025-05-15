'use client';

import CreateTricycleProvider from '@/features/tricycles/components/create-tricycle-provider';
import TricycleFormProgress from '@/features/tricycles/components/tricycle-form-progress';
import { useMobile } from '@/hooks/useMobile';
import { ReactNode } from 'react';

export default function CreateTricycleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isSmallScreen = useMobile({ max: 960 });
  return (
    <CreateTricycleProvider>
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-4 max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="lg:text-3xl text-xl font-semibold">
              Create your tricycle
            </h1>
            <p className="text-muted-foreground text-sm lg:text-lg">
              Create a tricycle information for operational use
            </p>
          </div>
          <div className="flex gap-8 items-start">
            {children}
            {!isSmallScreen && <TricycleFormProgress />}
          </div>
        </div>
      </div>
    </CreateTricycleProvider>
  );
}
