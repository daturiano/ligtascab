import CreateTricycleProvider from '@/features/tricycles/components/create-tricycle-provider';
import FormProgress from '@/features/tricycles/components/form-progress';
import React, { ReactNode } from 'react';

export default function CreateTricycleLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <CreateTricycleProvider>
      <div className="flex flex-col flex-1 justify-between">
        <div className="flex flex-col gap-4 max-w-screen-lg mx-auto">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Create your tricycle</h1>
            <p className="text-muted-foreground">
              Create a tricycle information for operational use
            </p>
          </div>
          <div className="flex gap-8 items-start">
            {children}
            <FormProgress />
          </div>
        </div>
      </div>
    </CreateTricycleProvider>
  );
}
