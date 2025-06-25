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
import Link from 'next/link';

const documents = [
  {
    id: 'certificate-of-registration',
    name: 'Registration',
    title: 'Certificate of Registration (CR)',
    description: 'Upload the tricycles Certificate of Registration (CR)',
    link: 'update-registration',
  },
  {
    id: 'official-receipt',
    name: 'Official Receipt',
    title: 'Official Receipt (OR)',
    description: 'Upload the tricycles Official Receipt (OR)',
    link: 'update-or',
  },
  {
    id: 'certificate-of-franchise',
    name: 'Franchise',
    title: 'Franichse Certificate',
    description: 'Upload the tricycles Official Receipt (OR)',
    link: 'update-franchise',
  },
  {
    id: 'inspection-certificate',
    name: 'Maintenance',
    title: 'Vehicle Inspection Certificate',
    description: 'Upload the tricycles Vehicle Inspection Certificate',
    link: 'update-maintenance',
  },
];

type ViewTricycleComplianceProps = {
  path: string;
  tricycle_id: string;
};

export default function ViewTricycleCompliance({
  path,
  tricycle_id,
}: ViewTricycleComplianceProps) {
  const supabase = createClient();
  return (
    <div className="flex flex-col gap-2">
      {documents.map((item) => {
        const sanitizedTitle = item.id
          .replace(/[^a-z0-9]/gi, '_')
          .toLowerCase();
        const { data: image } = supabase.storage
          .from('documents')
          .getPublicUrl(`${path}/${item.id}/${sanitizedTitle}.jpg`);
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
                <Link href={`${tricycle_id}/update-document?type=${item.link}`}>
                  <Button>Update Document</Button>
                </Link>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        );
      })}
    </div>
  );
}
