'use client';

import LogoWithName from '@/components/ui/logo-with-name';
import CreateDriverProvider from '@/features/drivers/components/create-driver-provider';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export default function UpdateLicenseLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <CreateDriverProvider>
      <div className="flex flex-col space-y-12 min-h-screen min-w-screen inset-0 fixed z-50 bg-background">
        <div className="p-6 bg-white">
          <div className="flex flex-row justify-between items-center max-w-screen-xl mx-auto">
            <LogoWithName />
            <X onClick={() => router.back()} className="cursor-pointer" />
          </div>
        </div>
        <div className="flex flex-1 mx-auto">
          <div className="flex flex-col gap-6 flex-1 max-w-screen-xl mx-auto">
            <div className="flex flex-col gap-2">
              <h1 className="lg:text-3xl text-xl font-semibold">
                Update your driver&apos;s license
              </h1>
              <p className="text-muted-foreground text-sm lg:text-lg">
                Please upload the front and back image of the driver&apos;s
                license.
              </p>
            </div>
            <div className="flex gap-8 items-start">{children}</div>
          </div>
        </div>
      </div>
    </CreateDriverProvider>
  );
}
