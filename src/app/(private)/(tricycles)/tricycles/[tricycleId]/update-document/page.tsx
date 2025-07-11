'use client';

import LogoWithName from '@/components/ui/logo-with-name';
import UpdateFranchiseForm from '@/features/tricycles/components/update-franchise-form';
import UpdateMaintenanceForm from '@/features/tricycles/components/update-maintenance-form';
import UpdateRegistrationForm from '@/features/tricycles/components/update-registration-form';
import { X } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const formMap: Record<string, React.ComponentType<{ tricycleId: string }>> = {
  'update-or/cr': UpdateRegistrationForm,
  'update-franchise': UpdateFranchiseForm,
  'update-maintenance': UpdateMaintenanceForm,
};

export default function UpdateDocumentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tricycleId = params.id as string;
  const type = searchParams.get('type');

  const FormComponent = type ? formMap[type] : null;

  if (!FormComponent) return <div>Not found</div>;

  return (
    <div className="flex flex-col space-y-12 min-h-screen min-w-screen inset-0 absolute z-50 bg-background">
      <div className="p-6 bg-white">
        <div className="flex flex-row justify-between items-center max-w-screen-xl mx-auto">
          <LogoWithName />
          <X onClick={() => router.back()} className="cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-1 mx-auto gap-8 px-2 items-start">
        <FormComponent tricycleId={tricycleId} />
      </div>
    </div>
  );
}
