'use client';

import TricycleNavigation from '@/features/tricycles/components/tricycle-navigation';
import { ReactNode } from 'react';

export default function TricyclesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-4 space-y-10 flex flex-col flex-1">
      <TricycleNavigation />
      <div className="flex flex-col flex-1">{children}</div>
    </div>
  );
}
