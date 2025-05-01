import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getDriverById } from '@/features/drivers/db/drivers';
import { formatDate } from '@/lib/utils';

export default async function page({
  params,
}: {
  params: Promise<{ driverId: string }>;
}) {
  const driverId = (await params).driverId;
  const driver = await getDriverById(driverId);
  if (!driver) return null;
  console.log(driver);
  return (
    <div className="space-y-4 w-full lg:px-20 max-w-screen-2xl mx-auto flex">
      <Card className="w-full max-w-[500px] py-0">
        <CardHeader className="w-full flex flex-col items-center justify-center bg-muted-foreground/5  rounded-t-xl py-4">
          <CardTitle>
            <div className="relative">
              <Avatar className="size-36 rounded-full">
                {/* <AvatarImage
              src={driver?.image ?? undefined}
              alt={driver?.first_name ?? undefined}
            /> */}
                <AvatarFallback className="size-36 border-1 border-white rounded-full bg-gray-300 flex items-center justify-center text-2xl font-medium">
                  <p>
                    {driver?.first_name.charAt(0).toUpperCase()}
                    {driver?.last_name.charAt(0).toUpperCase()}
                  </p>
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-1.5 right-1.5 h-8 w-8 rounded-full ${
                  driver.status === 'active' ? 'bg-primary' : 'bg-destructive'
                }`}
              ></div>
            </div>
          </CardTitle>
          <CardDescription>
            <p className="text-lg text-black">
              {driver.first_name} {driver.last_name}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 pb-6">
          <h1 className="text-lg font-semibold">Driver Details</h1>
          <p>
            <span className="text-muted-foreground">Birthday: </span>
            {formatDate(driver.birth_date.toLocaleString())}
          </p>
          <p>
            <span className="text-muted-foreground">Address: </span>
            {driver.address}
          </p>
          <p>
            <span className="text-muted-foreground">Phone Number: </span>
            {driver.phone_number}
          </p>
          <Separator className="my-2" />
          <h1 className="text-lg font-semibold">License Details</h1>
          <p>
            <span className="text-muted-foreground">License Expiration: </span>
            {formatDate(driver.license_expiration.toLocaleString())}
          </p>
          <p>
            <span className="text-muted-foreground">License Number: </span>
            {driver.license_number}
          </p>
          <Separator className="my-2" />
          <h1 className="text-lg font-semibold">Emergency Details</h1>
          <p>
            <span className="text-muted-foreground">
              Emergency Contact Name:{' '}
            </span>
            {driver.emergency_contact_name}
          </p>
          <p>
            <span className="text-muted-foreground">
              Emergency Contact Number:{' '}
            </span>
            {driver.emergency_contact_number}
          </p>
        </CardContent>
        {/* <CardFooter>
          <p>Card Footer</p>
        </CardFooter> */}
      </Card>
      <div className="w-full">
        <p>hello</p>
      </div>
    </div>
  );
}
