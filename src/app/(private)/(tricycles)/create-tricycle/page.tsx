'use client';

import { useCreateTricycle } from '@/features/tricycles/components/create-tricycle-provider';
import TricycleComplianceForm from '@/features/tricycles/components/tricycle-compliance-form';
import TricycleDetailsForm from '@/features/tricycles/components/tricycle-details-form';
import TricycleMaintenanceForm from '@/features/tricycles/components/tricycle-maintenance-form';

export default function CreateTricyclePage() {
  const { step } = useCreateTricycle();

  return (
    <>
      {step == 1 && <TricycleDetailsForm />}
      {step == 2 && <TricycleComplianceForm />}
      {step == 3 && <TricycleMaintenanceForm />}
    </>
  );
}
