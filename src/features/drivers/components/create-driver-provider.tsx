'use client';

import { createContext, useContext, useState } from 'react';
import { DriverComplianceDetails, DriverDetails } from '../schemas/drivers';

export type AttachmentDetails = {
  [key: string]: {
    file: File | null;
    documentId: string;
    documentTitle: string;
  };
};

export type DriverFormData = {
  type: 'Driver';
  driverDetails?: DriverDetails;
  complianceDetails?: DriverComplianceDetails;
  attachmentDetails?: AttachmentDetails;
};

type CreateDriverContextType = {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  readonly: boolean;
  formData: DriverFormData;
  setData: (newData: Partial<DriverFormData>) => void;
};

const CreateDriverContext = createContext<CreateDriverContextType | undefined>(
  undefined
);

export default function CreateDriverProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<DriverFormData>({
    type: 'Driver',
  });
  const [step, setStep] = useState(2);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));
  let readonly = false;

  console.log(formData);

  const setData = (values: Partial<DriverFormData>) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  if (step === 5) {
    readonly = true;
  }

  return (
    <CreateDriverContext.Provider
      value={{
        formData,
        setData,
        step,
        nextStep,
        prevStep,
        readonly,
      }}
    >
      {children}
    </CreateDriverContext.Provider>
  );
}

export const useCreateDriver = () => {
  const context = useContext(CreateDriverContext);
  if (!context)
    throw new Error(
      'useCreateDriver must be used within a CreateDriverProvider'
    );
  return context;
};
