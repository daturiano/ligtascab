import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import React from 'react';

export default function ProgressBar() {
  return (
    <div className="h-16 w-full flex-col">
      <Progress value={33} className="h-1" />
      <div className="flex h-full items-center justify-between px-4 lg:px-24">
        <Button variant={'outline'}>Back</Button>
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-end text-xs text-muted-foreground">
            <p>Next step:</p>
            <p>Address:</p>
          </div>
          <Button>Continue</Button>
        </div>
      </div>
    </div>
  );
}
