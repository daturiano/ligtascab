'use client';

import { createContext, useContext, useState } from 'react';
import {
  ComplianceDetails,
  MaintenanceDetails,
  TricycleDetails,
} from '../schemas/tricycle';

export type FormData = {
  tricycleDetails?: TricycleDetails;
  complianceDetails?: ComplianceDetails;
  maintenanceDetails?: MaintenanceDetails;
};

type CreateTricycleContextType = {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  formData: FormData;
  setData: (newData: Partial<FormData>) => void;
};

const CreateTricycleContext = createContext<
  CreateTricycleContextType | undefined
>(undefined);

export default function CreateTricycleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<FormData>({});
  const [step, setStep] = useState(1);
  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  console.log(formData);

  const setData = (values: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...values }));
  };

  return (
    <CreateTricycleContext.Provider
      value={{
        formData,
        setData,
        step,
        nextStep,
        prevStep,
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
