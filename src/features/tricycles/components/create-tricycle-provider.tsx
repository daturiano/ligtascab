'use client';

import { createContext, useContext, useState } from 'react';
import {
  ComplianceDetails,
  MaintenanceDetails,
  TricycleDetails,
} from '../schemas/tricycle';
import { AttachmentDetails } from '@/lib/types';

export type TricycleFormData = {
  type: 'tricycle';
  tricycleDetails?: TricycleDetails;
  complianceDetails?: ComplianceDetails;
  maintenanceDetails?: MaintenanceDetails;
  attachmentDetails?: AttachmentDetails;
};

type CreateTricycleContextType = {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  readonly: boolean;
  formData: TricycleFormData;
  setData: (newData: Partial<TricycleFormData>) => void;
};

const CreateTricycleContext = createContext<
  CreateTricycleContextType | undefined
>(undefined);

export default function CreateTricycleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<TricycleFormData>({
    type: 'tricycle',
  });
  const [step, setStep] = useState(3);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));
  let readonly = false;

  console.log(formData);

  const setData = (values: Partial<TricycleFormData>) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  if (step === 5) {
    readonly = true;
  }

  return (
    <CreateTricycleContext.Provider
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
    </CreateTricycleContext.Provider>
  );
}

export const useCreateTricycle = () => {
  const context = useContext(CreateTricycleContext);
  if (!context)
    throw new Error(
      'useCreateTricycle must be used within a CreateTricycleProvider'
    );
  return context;
};
