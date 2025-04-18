'use client';

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
            <div key={item}>
              {currStep < step && step != 1 ? (
                <div
                  className={`flex gap-2 items-center rounded-md px-2 py-2 min-w-62`}
                >
                  <div className="size-6 rounded-full flex items-center justify-center bg-primary">
                    <p className="font-medium text-xs text-background">
                      {index + 1}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="whitespace-nowrap text-xs text-primary">
                      COMPLETED
                    </p>
                    <p className="whitespace-nowrap text-sm">{item}</p>
                  </div>
                </div>
              ) : (
                <div
                  className={`flex gap-2 items-center rounded-md px-2 py-3 min-w-62 ${
                    step == currStep
                      ? 'text-black bg-muted-foreground/10'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div
                    className={`size-6 rounded-full flex items-center justify-center ${
                      step == currStep ? 'bg-card' : 'bg-muted-foreground/10'
                    }`}
                  >
                    <p className="font-medium text-xs">{index + 1}</p>
                  </div>
                  <p className="whitespace-nowrap text-sm">{item}</p>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
