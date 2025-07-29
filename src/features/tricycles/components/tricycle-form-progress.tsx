'use client';

import FormProgress from '@/components/private/form-progress';
import { useCreateTricycle } from './create-tricycle-provider';

const stepsData = [
  'Operational & Tricycle Details',
  'Regulatory & Compliance',
  'Maintenance & Usage',
  'Documents',
  'Review',
];

export default function TricycleFormProgress() {
  const { step } = useCreateTricycle();
  return <FormProgress stepsData={stepsData} step={step} />;
}
