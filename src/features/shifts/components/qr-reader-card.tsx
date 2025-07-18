'use client';

import qrImage from '@/app/public/qr.png';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { useState } from 'react';
import QRCodeReader from './qr-reader';
import { Skeleton } from '@/components/ui/skeleton';

export function QRReaderCardSkeleton() {
  return <Skeleton className="bg-muted-foreground/20 min-w-sm rounded-xl" />;
}

export default function QRReaderCard() {
  const [isScanning, setIsScanning] = useState(false);
  return (
    <Card className="justify-between w-full h-full max-w-[350px] max-h-[650px] lg:max-w-[425px] lg:min-h-[645px] lg:max-h-[645px]">
      <CardHeader>
        <CardTitle>Log Driver Attendance</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {isScanning
            ? 'Log driver attendance using the driver QR Code.'
            : 'Press "Start Log Attendance" to start scanning the drivers QR Code.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isScanning ? (
          <QRCodeReader setIsScanning={setIsScanning} />
        ) : (
          <div className="flex items-center justify-center">
            <Image src={qrImage} alt="qr code" height={280} width={280} />
          </div>
        )}
      </CardContent>
      {!isScanning && (
        <CardFooter>
          <Button
            className="w-full rounded-2xl"
            onClick={() => setIsScanning(true)}
          >
            Start Log Attendance
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
