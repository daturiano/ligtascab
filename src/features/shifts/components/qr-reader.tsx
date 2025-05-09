import { Driver } from '@/features/drivers/schemas/drivers';
import { QrReader } from 'react-qr-reader';
import React, { useRef, useState } from 'react';
import { fetchDriverDetails } from '@/features/drivers/actions/drivers';
import ShiftForm from './shift-form';

export default function QRCodeReader() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const canScanRef = useRef(true);

  return (
    <div className="flex flex-col gap-2">
      <QrReader
        onResult={async (result) => {
          if (result && canScanRef.current) {
            canScanRef.current = false;
            const scannedQR = result.getText();
            const { data } = await fetchDriverDetails(scannedQR);
            setDriver(data);

            setTimeout(() => {
              canScanRef.current = true;
            }, 1000);
          }
        }}
        constraints={{
          facingMode: 'environment',
          width: { min: 640, ideal: 640 },
          height: { min: 480, ideal: 480 },
        }}
        videoId="qr-video"
        className="w-full h-full"
        videoContainerStyle={{
          position: 'relative',
          width: '100%',
          minHeight: '300px',
        }}
        videoStyle={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
      <ShiftForm driver={driver} />
    </div>
  );
}
