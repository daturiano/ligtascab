'use client';

import LogoWithName from '@/components/ui/logo-with-name';
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
    <div className="flex flex-col space-y-12 min-h-screen min-w-screen inset-0 absolute z-50 bg-background">
      <div className="p-6 bg-white">
        <div className="flex flex-row justify-between items-center max-w-screen-xl mx-auto">
          <LogoWithName />
          <X onClick={() => router.back()} className="cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-1 mx-auto gap-8 px-2 items-start">
        {children}
      </div>
    </div>
  );
}
