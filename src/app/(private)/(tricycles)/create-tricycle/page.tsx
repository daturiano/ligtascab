import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TricycleDetailsForm from '@/features/tricycles/components/tricycle-details-form';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

const stepsData = [
  'Operational & Tricycle Details',
  'Regulatory & Compliance',
  'Maintenance & Usage',
  'Documents',
  'Review',
];

export default function CreateTricyclePage() {
  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="flex flex-col gap-4 max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">Create your tricycle</h1>
          <p className="text-muted-foreground">
            Create a tricycle information for operational use
          </p>
        </div>
        <div className="flex gap-8">
          <TricycleDetailsForm />
          <Card>
            <CardContent className="flex flex-col gap-4">
              {stepsData.map((step, index) => (
                <div
                  className="flex gap-2 items-center rounded-md px-2 py-3 bg-muted-foreground/10 min-w-62"
                  key={step}
                >
                  <div className="size-6 rounded-full flex items-center justify-center bg-card">
                    <p className="font-medium text-xs">{index + 1}</p>
                  </div>
                  <p className="whitespace-nowrap text-sm">{step}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-full bg-card h-16 flex items-center">
        <div className="max-w-screen-lg w-full mx-auto flex justify-between">
          <Button variant={'outline'} size={'lg'}>
            <ArrowLeft />
            Back
          </Button>
          <Button size={'lg'}>Continue</Button>
        </div>
      </div>
    </div>
  );
}
