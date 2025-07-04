import errorImg from '@/app/public/close.png';
import { Button } from '@/components/ui/button';
import { Driver } from '@/lib/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Scanner } from '@yudiel/react-qr-scanner';
import Image from 'next/image';
import { useState } from 'react';
import { fetchDriverDetails } from '../actions/shifts';
import ShiftForm from './shift-form';

type QRCodeReaderProps = {
  setIsScanning: (isScanning: boolean) => void;
};

export default function QRCodeReader({ setIsScanning }: QRCodeReaderProps) {
  const [driverId, setDriverId] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: driver } = useQuery<Driver | null>({
    queryKey: ['driver-details', driverId],
    queryFn: async () => {
      if (!driverId) return null;
      const { data, error } = await fetchDriverDetails(driverId);
      if (error) {
        setScanError(
          'Unable to validate QR Code. Please make sure to show valid driver QR Code.'
        );
        return null;
      }
      return data;
    },
    enabled: !!driverId,
    retry: false,
  });

  const tryAgain = () => {
    setDriverId(null);
    setScanError(null);
    queryClient.removeQueries({ queryKey: ['driver-details'], exact: false });
  };

  if (driver) {
    return <ShiftForm driver={driver} setIsScanning={setIsScanning} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {!scanError ? (
        <Scanner
          onScan={(result) => {
            setDriverId(result[0].rawValue);
          }}
          constraints={{ facingMode: 'environment' }}
          paused={driverId !== null}
          sound={false}
          styles={{
            container: {
              position: 'relative',
              width: '100%',
              minHeight: '300px',
            },
            video: {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
              top: 0,
              left: 0,
            },
          }}
        />
      ) : scanError ? (
        <div className="flex flex-col items-center gap-4">
          <Image
            src={errorImg}
            alt="error"
            height={250}
            width={250}
            className="my-4"
          />
          <p className="text-destructive text-md">{scanError}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-600">Processing QR Code...</p>
          </div>
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
