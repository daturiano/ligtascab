'use client';

import { useCreateDriver } from '@/features/drivers/components/create-driver-provider';
import DriverDetailsForm from '@/features/drivers/components/driver-details-form';
import DriverLicenseForm from '@/features/drivers/components/driver-license-form';
import FormReview from '@/features/drivers/components/form-review';

export default function CreateDriverPage() {
  const { step } = useCreateDriver();

  return (
    <>
      {step == 1 && <DriverDetailsForm />}
      {step == 2 && <DriverLicenseForm />}
      {step == 3 && <FormReview />}
    </>
  );
}
