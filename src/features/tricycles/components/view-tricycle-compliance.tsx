'use client';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createClient } from '@/supabase/client';
import Image from 'next/image';

const documents = [
  {
    id: 'certificate-of-registration',
    name: 'Registration',
    title: 'Certificate of Registration (CR)',
    description: 'Upload the tricycles Certificate of Registration (CR)',
  },
  {
    id: 'official-receipt',
    name: 'Official Receipt',
    title: 'Official Receipt (OR)',
    description: 'Upload the tricycles Official Receipt (OR)',
  },
  {
    id: 'certificate-of-franchise',
    name: 'Franchise',
    title: 'Franichse Certificate',
    description: 'Upload the tricycles Official Receipt (OR)',
  },
  {
    id: 'inspection-certificate',
    name: 'Maintenance',
    title: 'Vehicle Inspection Certificate',
    description: 'Upload the tricycles Vehicle Inspection Certificate',
  },
];

type ViewTricycleComplianceProps = {
  path: string;
};

export default function ViewTricycleCompliance({
  path,
}: ViewTricycleComplianceProps) {
  const supabase = createClient();
  return (
    <div className="flex flex-col gap-2">
      {documents.map((item) => {
        const { data: image } = supabase.storage
          .from('documents')
          .getPublicUrl(`${path}/${item.id}/${item.id}.jpg`);
        return (
          <Dialog key={item.id}>
            <DialogTrigger className="bg-primary text-white p-2 text-sm rounded-md cursor-pointer">
              View {item.name}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>{item.title}</DialogTitle>
                <DialogDescription>
                  Please make sure to keep the tricycle&apos;s {item.title}{' '}
                  always up to date.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-center gap-4">
                <Image
                  src={image.publicUrl}
                  alt="image"
                  width={280}
                  height={280}
                />
              </div>
              <DialogFooter className="sm:justify-start">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}
