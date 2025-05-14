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
import { QRCodeCanvas } from 'qrcode.react';
import React from 'react';

type ViewQRCodeProps = {
  id: string;
  children: React.ReactNode;
};

export default function ViewQRCode({ id, children }: ViewQRCodeProps) {
  return (
    <Dialog>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tricycle QR Code</DialogTitle>
          <DialogDescription>
            Please make sure to attach to the corresponding tricycle.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <QRCodeCanvas
            value={id}
            minVersion={1}
            level="L"
            size={180}
            marginSize={4}
            title="Ligtascab"
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
