'use client';

import CreateDriverProvider from '@/features/drivers/components/create-driver-provider';
import DriverFormProgress from '@/features/drivers/components/driver-form-progress';
import { useMobile } from '@/hooks/useMobile';
import React, { ReactNode } from 'react';

export default function CreateDriverLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isSmallScreen = useMobile({ max: 960 });
  return (
    <CreateDriverProvider>
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-4 max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="lg:text-3xl text-xl font-semibold">
              Create your driver
            </h1>
            <p className="text-muted-foreground text-sm lg:text-lg">
              Create a driver information for operational use
            </p>
          </div>
          <div className="flex gap-8 items-start">
            {children}
            {!isSmallScreen && <DriverFormProgress />}
          </div>
        </div>
      </div>
    </CreateDriverProvider>
  );
}
