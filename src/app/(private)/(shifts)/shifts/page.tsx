'use client';

import React, { useState } from 'react';
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
import qrImage from '@/app/public/scan.png';
import QRCodeReader from '@/features/shifts/components/qr-reader';

export default function ShiftPage() {
  const [isScanning, setIsScanning] = useState(false);

  return (
    <div className="space-y-4 w-full gap-4 lg:px-20 max-w-screen-2xl mx-auto mb-16">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Log Driver Attendance</CardTitle>
          <CardDescription>
            {isScanning
              ? 'Place the driver QR Code in front of the camera.'
              : 'Press "Start Log Attendance" to start scanning the drivers QR Code.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isScanning ? (
            <QRCodeReader />
          ) : (
            <Image src={qrImage} alt="qr code" />
          )}
        </CardContent>
        <CardFooter>
          {!isScanning && (
            <Button
              className="w-full rounded-2xl"
              onClick={() => setIsScanning(true)}
            >
              Start Log Attendance
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
