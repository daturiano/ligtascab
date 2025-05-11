import errorImg from '@/app/public/close.png';
import { Button } from '@/components/ui/button';
import { fetchDriverDetails } from '@/features/drivers/actions/drivers';
import { Driver } from '@/features/drivers/schemas/drivers';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import ShiftForm from './shift-form';

type QRCodeReaderProps = {
  setIsScanning: (isScanning: boolean) => void;
};

export default function QRCodeReader({ setIsScanning }: QRCodeReaderProps) {
  const [driverId, setDriverId] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const { data: driver } = useQuery<Driver | null>({
    queryKey: ['driver-details', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      const { data, error } = await fetchDriverDetails(driverId);
      if (error) {
        setScanError(
          'Unable to validate QR Code. Please make sure to show valid driver QR Code.'
        );
      }
      return data;
    },
    enabled: !!driverId,
    retry: false,
  });

  const tryAgain = () => {
    setDriverId(null);
    setScanError(null);
  };

  if (driver) {
    return <ShiftForm driver={driver} setIsScanning={setIsScanning} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {!scanError ? (
        <QrReader
          onResult={(result) => {
            if (!!result) {
              setDriverId(result.getText());
            }
          }}
          constraints={{ facingMode: 'environment' }}
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
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Image
            src={errorImg}
            alt="error"
            height={300}
            width={300}
            className="my-4"
          />
          <p className="text-destructive text-md">{scanError}</p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {!scanError ? (
          <Button variant={'outline'}>Manual Entry</Button>
        ) : (
          <Button variant={'outline'} onClick={tryAgain}>
            Try Again
          </Button>
        )}
        <Button variant={'outline'} onClick={() => setIsScanning(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
