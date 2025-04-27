'use client';

import FormProgress from '@/components/form-progress';
import { useCreateDriver } from './create-driver-provider';

const stepsData = ['Driver & Emergency Details', 'License Details', 'Review'];

export default function DriverFormProgress() {
  const { step } = useCreateDriver();
  return <FormProgress stepsData={stepsData} step={step} />;
}
