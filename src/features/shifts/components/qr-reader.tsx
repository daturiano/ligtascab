import { Button } from '@/components/ui/button';
import { fetchDriverDetails } from '@/features/drivers/actions/drivers';
import { Driver } from '@/features/drivers/schemas/drivers';
import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import ShiftForm from './shift-form';

type QRCodeReaderProps = {
  setIsScanning: (isScanning: boolean) => void;
};

export default function QRCodeReader({ setIsScanning }: QRCodeReaderProps) {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [canScan, setCanScan] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleResult = async (result: any) => {
    if (result && canScan) {
      setCanScan(false);
      const scannedQR = result.getText();
      const { data } = await fetchDriverDetails(scannedQR);
      setDriver(data);
    }
  };

  return (
    <div>
      {!driver && canScan ? (
        <div className="flex flex-col gap-4">
          <QrReader
            onResult={handleResult}
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
          <div className="flex flex-col gap-2">
            <Button variant={'outline'}>Manual Entry</Button>
            <Button variant={'outline'} onClick={() => setIsScanning(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div>{driver && <ShiftForm driver={driver} />}</div>
      )}
    </div>
  );
}
