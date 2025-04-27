'use client';

import { useCreateDriver } from '@/features/drivers/components/create-driver-provider';
import DriverDetailsForm from '@/features/drivers/components/driver-details-form';

export default function CreateDriverPage() {
  const { step } = useCreateDriver();

  return <>{step == 1 && <DriverDetailsForm />}</>;
}
