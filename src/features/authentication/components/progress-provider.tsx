'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type PersonalDetails = {
  first_name?: string;
  last_name?: string;
  birth_date?: Date;
  dial_code?: string;
  phone_number?: string;
};

type AddressDetails = {
  province?: string;
  municipality?: string;
  address?: string;
  postal_code?: string;
};

type FormData = {
  personalDetails?: PersonalDetails;
  addressDetails?: AddressDetails;
};

type ProgressContextType = {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  isFormValid: boolean;
  setFormValid: (isValid: boolean) => void;
  formData: FormData;
  updateData: (newData: Partial<FormData>) => void;
};

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

export default function ProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [step, setStep] = useState(1);
  const [isFormValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState<FormData>({});
  const [isInitialized, setIsInitialized] = useState(false);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => Math.max(1, prev - 1));

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('accountSetupData');

      if (storedData) {
        const parsed = JSON.parse(storedData);

        // Create a new object to hold the processed data
        const processedData: FormData = { ...(parsed.formData || {}) };

        // Convert birth_date string back to Date object if it exists
        if (parsed.formData?.personalDetails?.birth_date) {
          processedData.personalDetails = {
            ...(processedData.personalDetails || {}),
            birth_date: new Date(parsed.formData.personalDetails.birth_date),
          };
        }

        setStep(parsed.step || 1);
        setFormData(processedData);
      }
    } catch (error) {
      console.error('Error loading stored data:', error);
      localStorage.removeItem('accountSetupData');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(
        'accountSetupData',
        JSON.stringify({ step, formData })
      );
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [step, formData, isInitialized]);

  const updateData = (newData: Partial<FormData>) => {
    setFormData((prev) => {
      const updated = { ...prev };

      if (newData.personalDetails) {
        updated.personalDetails = {
          ...(prev.personalDetails || {}),
          ...newData.personalDetails,
        };
      }

      if (newData.addressDetails) {
        updated.addressDetails = {
          ...(prev.addressDetails || {}),
          ...newData.addressDetails,
        };
      }

      return updated;
    });
  };

  return (
    <ProgressContext.Provider
      value={{
        step,
        nextStep,
        prevStep,
        isFormValid,
        setFormValid,
        formData,
        updateData,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};
