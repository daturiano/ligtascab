'use client';

import AddressForm from '@/features/authentication/components/address-form';
import { useCreateOperator } from '@/features/authentication/components/create-operator-provider';
import FormReview from '@/features/authentication/components/form-review';
import OperatorDocumentsUpload from '@/features/authentication/components/operator-documents-upload';
import PersonalDetailsForm from '@/features/authentication/components/personal-details-form';

export default function AccountSetupPage() {
  const { step } = useCreateOperator();

  return (
    <>
      {step === 1 && <PersonalDetailsForm />}
      {step === 2 && <AddressForm />}
      {step === 3 && <OperatorDocumentsUpload />}
      {step === 4 && <FormReview />}
    </>
  );
}
