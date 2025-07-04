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
import { Tricycle } from '@/lib/types';
import DocumentStatusBadge from '../../../components/document-status-badge';

type ViewTricycleComplianceProps = {
  path: string;
  tricycle: Tricycle;
};

export default function ViewTricycleCompliance({
  path,
  tricycle,
}: ViewTricycleComplianceProps) {
  const supabase = createClient();

  const documents = [
    {
      id: 'or/cr',
      name: 'Receipt & Registration',
      title: 'Official Receipt & Certificate of Registration',
      description: 'Upload the tricycles Certificate of Registration (CR)',
      link: 'update-or/cr',
      expiration_date: tricycle.registration_expiration,
    },
    {
      id: 'certificate-of-franchise',
      name: 'Franchise',
      title: 'Franchise Certificate',
      description: 'Upload the tricycles Franchise Certificate',
      link: 'update-franchise',
      expiration_date: tricycle.franchise_expiration,
    },
    {
      id: 'inspection-certificate',
      name: 'Maintenance',
      title: 'Vehicle Inspection Certificate',
      description: 'Upload the tricycles Vehicle Inspection Certificate',
      link: 'update-maintenance',
      expiration_date: tricycle.last_maintenance_date,
    },
  ];

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
                <DialogTitle className="flex flex-row gap-4 items-center">
                  <p>{item.title}</p>
                  <DocumentStatusBadge date={item.expiration_date} />
                </DialogTitle>
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
                <Link href={`${tricycle.id}/update-document?type=${item.link}`}>
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
