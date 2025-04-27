import CreateDriverProvider from '@/features/drivers/components/create-driver-provider';
import React, { ReactNode } from 'react';

export default function CreateDriverLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CreateDriverProvider>
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-4 max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Create your driver</h1>
            <p className="text-muted-foreground">
              Create a driver information for operational use
            </p>
          </div>
          <div className="flex gap-8 items-start">{children}</div>
        </div>
      </div>
    </CreateDriverProvider>
  );
}
