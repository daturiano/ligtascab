'use client';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Spinner from '@/components/ui/spinner';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { submitUserFormData } from '../actions/authentication';
import { useProgress } from './progress-provider';

export default function ProgressBar() {
  const { step, prevStep, nextStep, isFormValid, formData } = useProgress();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  let progressValue;
  switch (step) {
    case 1:
      progressValue = 33;
      break;
    case 2:
      progressValue = 66;
      break;
    case 3:
      progressValue = 100;
      break;
  }

  const continueBtnHandler = () => {
    if (step !== 3) {
      nextStep();
      return;
    }
    submitForm();
  };

  const submitForm = async () => {
    setIsSubmitting(true);

    try {
      const result = await submitUserFormData(formData);

      if (result?.success) {
        toast.success('Your information has been successfully saved!');
        router.push('/sign-in');
      } else {
        toast.error(`Failed to save your information: ${result?.error}`);
        return null;
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Form submission error:', error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-16 w-full flex-col">
      <Progress value={progressValue} className="h-1" />
      <div
        className={`flex h-full items-center justify-between px-4 lg:px-24 ${
          step === 1 && 'justify-end'
        }`}
      >
        <Button
          variant={'outline'}
          className={`${step === 1 && 'hidden'}`}
          onClick={prevStep}
        >
          Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-end text-xs text-muted-foreground">
            <p>Next step:</p>
            <p>Address:</p>
          </div>
          <Button onClick={continueBtnHandler} disabled={!isFormValid}>
            {isSubmitting ? <Spinner /> : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
