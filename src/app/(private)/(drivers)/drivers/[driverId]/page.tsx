import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { fetchDriverDetails } from '@/features/drivers/actions/drivers';
import DriverProfileCard from '@/features/drivers/components/driver-profile-card';
import { DriverShiftsTable } from '@/features/drivers/components/driver-shifts-table';
import Image from 'next/image';
import license from '@/app/public/license.png';
import qrcode from '@/app/public/qr-code.png';
import { Button } from '@/components/ui/button';
import ViewQRCode from '@/components/view-qr-code';
import { createClient } from '@/supabase/server';
import ViewDriverLicense from '@/features/drivers/components/view-driver-license';

export default async function DriverProfilePage({
  params,
}: {
  params: Promise<{ driverId: string }>;
}) {
  const driverId = (await params).driverId;
  const { data: driver } = await fetchDriverDetails(driverId);
  if (!driver) return null;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="flex space-y-6 gap-4 mx-auto mb-12">
      <div className="flex gap-4">
        <DriverProfileCard driver={driver} />
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-row gap-4 flex-1">
            <Card className="w-full">
              <CardTitle className="px-6">Driver&apos;s License</CardTitle>
              <CardContent className="flex gap-4">
                <div className="min-h-32 min-w-32 bg-gray-300 flex items-center justify-center rounded-md">
                  <Image src={license} alt="license" width={80} height={80} />
                </div>
                <div className="w-full flex flex-col justify-between">
                  <p className="text-muted-foreground text-sm">
                    Keep the driver&apos;s license always up to date. Failure to
                    do so will disable the usage of this driver.
                  </p>
                  <div className="flex flex-row gap-2">
                    <ViewDriverLicense
                      path={`${user.id}/drivers/${driver.id}`}
                    />
                    <Button className="flex-1" variant={'outline'}>
                      Update License
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full">
              <CardTitle className="px-6">Driver&apos;s QR Code</CardTitle>
              <CardContent className="flex gap-4">
                <div className="min-h-32 min-w-32 bg-gray-300 flex items-center justify-center rounded-md">
                  <Image src={qrcode} alt="license" width={60} height={60} />
                </div>
                <div className="w-full flex flex-col justify-between">
                  <p className="text-muted-foreground text-sm">
                    Make sure to only provide this QR Code to the driver itself.
                    Please do not share this to others.
                  </p>
                  <div className="flex flex-row gap-2">
                    <ViewQRCode id={driver.id}>
                      <Button className="w-full">View QR Code</Button>
                    </ViewQRCode>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DriverShiftsTable id={driver.id} />
        </div>
      </div>
    </div>
  );
}
