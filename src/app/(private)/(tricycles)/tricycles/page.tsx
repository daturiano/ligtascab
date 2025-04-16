'use client';

import emptyImage from '@/app/public/empty.svg';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TricycleCard from '@/features/tricycles/components/tricycle-card';
import { getAllTricycles } from '@/features/tricycles/db/tricycles';
import { Tricycle } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import Image from 'next/image';

export default function TricyclesPage() {
  const { data: tricycles, error } = useQuery({
    queryKey: ['tricycles'],
    queryFn: getAllTricycles,
  });

  if (error) {
    return <div>Error loading tricycles: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Tricycles</h1>
        <div className="w-full flex items-center gap-4">
          <Input
            startIcon={Search}
            placeholder="Search by plate number"
            className="py-6 bg-card rounded-3xl placeholder:tracking-wide placeholder:text-muted-foreground"
          />
          <div className="h-13 bg-card w-full rounded-lg flex items-center justify-between">
            <div className="flex gap-2 items-center"></div>
          </div>
        </div>
      </div>
      <div className="min-w-full border-[0.3px] relative rounded-2xl min-h-96 max-h-[33rem] overflow-auto bg-card flex flex-col items-center justify-center">
        {!tricycles ? (
          <>
            <Image src={emptyImage} alt="empty image" className="size-36" />
            <div className="flex flex-col space-y-4 text-center mb-8">
              <h2 className="text-xl font-medium">
                Your tricycles will appear here
              </h2>
              <h3 className="text-md text-muted-foreground">
                After you create a new vehicle, you will see it here.
              </h3>
            </div>
            <Button className="p-5">Create a vehicle</Button>
          </>
        ) : (
          <div className="w-full">
            {tricycles?.map((tricycle: Tricycle) => {
              return <TricycleCard tricycle={tricycle} key={tricycle.id} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
