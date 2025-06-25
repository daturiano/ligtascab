import license from '@/app/public/license.png';
import qrcode from '@/app/public/qr-code.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ViewQRCode from '@/components/view-qr-code';
import { fetchDriverDetails } from '@/features/drivers/actions/drivers';
import DriverProfileCard from '@/features/drivers/components/driver-profile-card';
import { DriverShiftsTable } from '@/features/drivers/components/driver-shifts-table';
import ViewDriverLicense from '@/features/drivers/components/view-driver-license';
import { createClient } from '@/supabase/server';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
    <div className="flex flex-col space-y-6 h-full">
      <Link href={'/drivers'} className="w-0">
        <ArrowLeft size={28} />
      </Link>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-3 xl:grid-cols-[auto_1fr] xl:grid-rows-[auto_1fr] flex-1 min-h-0">
        <div className="xl:col-start-1 xl:col-end-2 xl:row-start-1 xl:row-end-4">
          <DriverProfileCard driver={driver} />
        </div>
        <div className="flex flex-col gap-4 md:justify-between xl:flex-row xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2">
          <Card className="w-full grow xl:grow-0 max-w-[500px] xl:max-w-[600px]">
            <CardTitle className="px-6">Driver&apos;s License</CardTitle>
            <CardContent className="flex grow gap-4">
              <div className="min-h-32 min-w-32 bg-gray-300 flex items-center justify-center rounded-md">
                <Image src={license} alt="license" width={80} height={80} />
              </div>
              <div className="w-full gap-4 flex flex-col justify-between">
                <p className="text-muted-foreground text-sm">
                  Keep the driver&apos;s license always up to date. Failure to
                  do so will disable the usage of this driver.
                </p>
                <div className="flex flex-col gap-2">
                  <ViewDriverLicense path={`${user.id}/drivers/${driver.id}`} />
                  <Link href={`/drivers/${driver.id}/update-license`}>
                    <Button className="flex-1 w-full" variant={'outline'}>
                      Update License
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full grow xl:grow-0 max-w-[500px] xl:max-w-[600px]">
            <CardTitle className="px-6">Driver&apos;s QR Code</CardTitle>
            <CardContent className="flex grow gap-4">
              <div className="min-h-32 min-w-32 bg-gray-300 flex items-center justify-center rounded-md">
                <Image src={qrcode} alt="license" width={60} height={60} />
              </div>
              <div className="w-full flex flex-col justify-between gap-4">
                <p className="text-muted-foreground text-sm">
                  Make sure to only provide this QR Code to the driver itself.
                  Please do not share this to others.
                </p>
                <div className="flex flex-row gap-2">
                  <ViewQRCode id={driver.id}>
                    <div className="w-full bg-primary text-white p-2 text-sm rounded-md cursor-pointer">
                      View QR Code
                    </div>
                  </ViewQRCode>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-start-1 md:col-end-3 xl:col-start-2 xl:col-end-3 xl:row-start-2 xl:row-end-4 flex flex-col min-h-0">
          <DriverShiftsTable id={driver.id} />
        </div>
      </div>
    </div>
  );
}
