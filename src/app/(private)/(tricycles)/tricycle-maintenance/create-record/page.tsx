'use client';

import LogoWithName from '@/components/ui/logo-with-name';
import MaintenanceRecordForm from '@/features/tricycles/components/maintenance-record-form';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function CreateRecordPage() {
  const router = useRouter();
  return (
    <div className="flex flex-col space-y-12 min-h-screen inset-0 absolute z-50 overflow-x-hidden bg-background">
      <div className="py-6 bg-white">
        <div className="flex flex-row justify-between items-center max-w-screen-xl mx-auto">
          <LogoWithName />
          <X onClick={() => router.back()} className="cursor-pointer" />
        </div>
      </div>
      <MaintenanceRecordForm />
    </div>
  );
}
