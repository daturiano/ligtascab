'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useCreateDriver } from './create-driver-provider';
import { useRouter } from 'next/navigation';

type FormBottomNavigationProps = {
  onSubmit: () => void;
  formName?: string;
  step?: number;
  skip?: boolean;
};

export default function FormBottomNavigation({
  onSubmit,
  formName,
  skip = false,
}: FormBottomNavigationProps) {
  const { prevStep, step } = useCreateDriver();
  const router = useRouter();
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
        <div className="flex items-center gap-2">
          {skip && (
            <Button
              size={'lg'}
              onClick={() => router.push('/drivers')}
              variant={'outline'}
              className="text-xs lg:text-sm"
            >
              Continue without creating driver account
            </Button>
          )}
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
    </div>
  );
}
