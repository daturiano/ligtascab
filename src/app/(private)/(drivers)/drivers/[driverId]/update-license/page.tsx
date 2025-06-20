'use client';

import UpdateLicenseForm from '@/features/drivers/components/update-license-form';
import { useSearchParams } from 'next/navigation';

export default function UpdateLicensePage() {
  const searchParams = useSearchParams();
  const driver_id = searchParams.get('driverId');

  if (!driver_id) return null;
  return (
    <>
      <UpdateLicenseForm driver_id={driver_id} />
    </>
  );
}
