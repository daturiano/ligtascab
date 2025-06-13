'use client';

import { AttachmentDetails } from '@/lib/types';
import { createContext, useContext, useState } from 'react';
import { AddressDetails, PersonalDetails } from '../schemas/authentication';

export type AccountSetupFormData = {
  type: 'account-setup';
  personalDetails?: PersonalDetails;
  addressDetails?: AddressDetails;
  attachmentDetails?: AttachmentDetails;
};

type CreateOperatorContextType = {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  readonly: boolean;
  formData: AccountSetupFormData;
  setData: (newData: Partial<AccountSetupFormData>) => void;
};

const CreateOperatorContext = createContext<
  CreateOperatorContextType | undefined
>(undefined);

export default function CreateOperatorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<AccountSetupFormData>({
    type: 'account-setup',
  });

  const [step, setStep] = useState(1);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));
  let readonly = false;

  const setData = (values: Partial<AccountSetupFormData>) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  if (step === 4) {
    readonly = true;
  }

  return (
    <CreateOperatorContext.Provider
      value={{
        step,
        nextStep,
        prevStep,
        formData,
        setData,
        readonly,
      }}
    >
      {children}
    </CreateOperatorContext.Provider>
  );
}

export const useCreateOperator = () => {
  const context = useContext(CreateOperatorContext);
  if (context === undefined) {
    throw new Error(
      'useCreateOperator must be used within CreateOperatorProvider'
    );
  }
  return context;
};
