'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useCreateTricycle } from './create-tricycle-provider';

type FormBottomNavigationProps = {
  onSubmit: () => void;
  formName?: string;
  step?: number;
};

export default function FormBottomNavigation({
  onSubmit,
  formName,
}: FormBottomNavigationProps) {
  const { prevStep, step } = useCreateTricycle();
  return (
    <div
      className={`min-w-screen px-4 bg-card h-16 flex items-center fixed bottom-0 left-0`}
    >
      <div className="mx-auto flex justify-between lg:max-w-screen-2xl w-full">
        <Button
          variant={'outline'}
          className="text-xs lg:text-sm"
          size={'lg'}
          onClick={prevStep}
          disabled={step === 1}
        >
          <ArrowLeft />
          Back
        </Button>
        <Button
          size={'lg'}
          onClick={onSubmit}
          form={formName}
          className="text-xs lg:text-sm"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
