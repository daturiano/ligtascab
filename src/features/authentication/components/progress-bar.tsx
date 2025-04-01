import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import React from 'react';
import { useProgress } from './progress-provider';

export default function ProgressBar() {
  const { step, prevStep, nextStep, isFormValid } = useProgress();

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
          <Button onClick={nextStep} disabled={!isFormValid}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
