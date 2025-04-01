'use client';

import AddressForm from '@/features/authentication/components/address-form';
import { DocumentUpload } from '@/features/authentication/components/file-upload';
import PersonalDetailsForm from '@/features/authentication/components/personal-details-form';
import ProgressBar from '@/features/authentication/components/progress-bar';
import { useProgress } from '@/features/authentication/components/progress-provider';

export default function AccountSetupPage() {
  const { step } = useProgress();

  return (
    <div className="w-full h-[90dvh] flex flex-col">
      <div className="flex flex-grow items-center justify-evenly px-4">
        {step === 1 && <PersonalDetailsForm />}
        {step === 2 && <AddressForm />}
        {step === 3 && <DocumentUpload bucketName="documents" />}
      </div>
      <ProgressBar />
    </div>
  );
}
