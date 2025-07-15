'use client';

import DocumentStatusBadge from '@/components/document-status-badge';
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
import React from 'react';

type ViewDriverLicenseProps = {
  path: string;
  license_expiration: Date;
};

export default function ViewDriverLicense({
  license_expiration,
  path,
}: ViewDriverLicenseProps) {
  const supabase = createClient();
  const { data: back_url } = supabase.storage
    .from('documents')
    .getPublicUrl(`${path}/license-back/license_back.jpg`);

  const { data: front_url } = supabase.storage
    .from('documents')
    .getPublicUrl(`${path}/license-front/license_front.jpg`);

  return (
    <Dialog>
      <DialogTrigger className="bg-primary text-white p-2 text-sm rounded-md cursor-pointer">
        View License
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-4 items-center">
            <p>Driver&apos;s License </p>
            <DocumentStatusBadge date={license_expiration} />
          </DialogTitle>
          <DialogDescription>
            Please make sure to keep the driver&apos;s license always up to
            date.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-4">
          <Image
            src={front_url.publicUrl}
            alt="license_front"
            width={280}
            height={280}
          />
          <Image
            src={back_url.publicUrl}
            alt="license_back"
            width={280}
            height={280}
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="cursor-pointer">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
