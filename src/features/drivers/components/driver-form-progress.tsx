'use client';

import FormProgress from '@/components/private/form-progress';
import { useCreateDriver } from './create-driver-provider';

const stepsData = [
  'Driver & Emergency Details',
  'License Details',
  'Review',
  'Driver Account Setup',
];

export default function DriverFormProgress() {
  const { step } = useCreateDriver();
  return <FormProgress stepsData={stepsData} step={step} />;
}
