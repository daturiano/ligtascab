import docuimg from '@/app/public/approve.png';
import qrcode from '@/app/public/qr-code.png';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import ViewQRCode from '@/components/view-qr-code';
import { fetchTricycleDetails } from '@/features/tricycles/actions/tricycles';
import TricycleProfileCard from '@/features/tricycles/components/tricycle-profile-card';
import ViewTricycleCompliance from '@/features/tricycles/components/view-tricycle-compliance';
import { createClient } from '@/supabase/server';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function TricycleProfilePage({
  params,
}: {
  params: Promise<{ tricycleId: string }>;
}) {
  const tricycleId = (await params).tricycleId;
  const { data: tricycle } = await fetchTricycleDetails(tricycleId);
  console.log(tricycle);
  if (!tricycle) return null;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="flex flex-col space-y-6">
      <Link href={'/tricycles'}>
        <ArrowLeft size={28} />
      </Link>
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:grid-rows-3 xl:grid-cols-[auto_1fr]">
        <div className="xl:col-start-1 xl:col-end-2 xl:row-start-1 xl:row-end-4">
          <TricycleProfileCard tricycle={tricycle} />
        </div>
        <div className="flex flex-col gap-4 md:justify-between xl:flex-row xl:col-start-2 xl:col-end-3 xl:row-start-1 xl:row-end-2">
          <Card className="w-full grow xl:grow-0 max-w-[500px] xl:max-w-[600px]">
            <CardTitle className="px-6">
              Tricycle&apos;s Compliance Documents
            </CardTitle>
            <CardContent className="flex grow gap-4">
              <div className="min-h-32 min-w-32 bg-gray-300/60 flex items-center justify-center rounded-md">
                <Image
                  src={docuimg}
                  alt="document image"
                  width={80}
                  height={80}
                />
              </div>
              <div className="w-full gap-4 flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <ViewTricycleCompliance
                    path={`${user.id}/tricycles/${tricycle.id}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="w-full grow xl:grow-0 max-w-[500px] xl:max-w-[600px]">
            <CardTitle className="px-6">Tricycle&apos;s QR Code</CardTitle>
            <CardContent className="flex grow gap-4">
              <div className="min-h-32 min-w-32 bg-gray-300 flex items-center justify-center rounded-md">
                <Image src={qrcode} alt="license" width={60} height={60} />
              </div>
              <div className="w-full flex flex-col justify-between gap-4">
                <p className="text-muted-foreground text-sm">
                  Make sure to attach this QR Code to the correct tricycle.
                </p>
                <div className="flex flex-row gap-2">
                  <ViewQRCode id={tricycle.id}>
                    <div className="w-full bg-primary text-white p-2 text-sm rounded-md cursor-pointer">
                      View QR Code
                    </div>
                  </ViewQRCode>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
