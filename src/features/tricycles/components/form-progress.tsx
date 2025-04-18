'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCreateTricycle } from './create-tricycle-provider';

const stepsData = [
  'Operational & Tricycle Details',
  'Regulatory & Compliance',
  'Maintenance & Usage',
  'Documents',
  'Review',
];

export default function FormProgress() {
  const { step } = useCreateTricycle();

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        {stepsData.map((item, index) => {
          const currStep = index + 1;
          return (
            <div
              className={`flex gap-2 items-center rounded-md px-2 py-3 bg-muted-foreground/4 min-w-62 ${
                step === currStep && 'bg-muted-foreground/10'
              }`}
              key={item}
            >
              <div className="size-6 rounded-full flex items-center justify-center bg-card">
                <p className="font-medium text-xs">{index + 1}</p>
              </div>
              <p className="whitespace-nowrap text-sm">{item}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
