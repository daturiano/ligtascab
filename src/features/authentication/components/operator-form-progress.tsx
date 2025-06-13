'use client';

import FormProgress from '@/components/form-progress';
import { useCreateOperator } from './create-operator-provider';
const stepsData = [
  'Personal Details',
  'Address Details',
  'Compliance Details',
  'Review',
];

export default function OperatorFormProgress() {
  const { step } = useCreateOperator();
  return <FormProgress stepsData={stepsData} step={step} />;
}
