'use client';

import PersonalDetailsForm from '@/features/authentication/components/personal-details-form';
import ProgressBar from '@/features/authentication/components/progress-bar';
import { useProgress } from '@/features/authentication/components/progress-provider';

export default function AccountSetupPage() {
  const { step } = useProgress();

  return (
    <div className="w-full h-[90dvh] flex flex-col">
      <div className="flex flex-grow items-center justify-evenly px-4">
        {step === 1 && <PersonalDetailsForm />}
      </div>
      <ProgressBar />
    </div>
  );
}
