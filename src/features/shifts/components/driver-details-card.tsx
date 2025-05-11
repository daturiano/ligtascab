'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDate, formatDateTime } from '@/lib/utils';
import { fetchDriverMostRecentLog } from '../actions/shifts';
import { Driver } from '@/features/drivers/schemas/drivers';
import { useQuery } from '@tanstack/react-query';

type DriverDetailsCardProps = {
  driver: Driver;
};

export default function DriverDetailsCard({ driver }: DriverDetailsCardProps) {
  const { data: recent_log } = useQuery({
    queryKey: ['recent_log'],
    queryFn: () => fetchDriverMostRecentLog(driver.id),
  });

  return (
    <Card className="gap-2 shadow-none bg-muted-foreground/5">
      <CardHeader className="font-semibold">Driver Details</CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <Avatar className="size-18 rounded-md">
            <AvatarImage
              // src={driver?.image}
              alt={driver.first_name}
            />
            <AvatarFallback className="size-18 border-1 border-white rounded-md bg-gray-300 flex items-center justify-center">
              <p>{driver.first_name.charAt(0).toUpperCase()}</p>
              <p>{driver.last_name.charAt(0).toUpperCase()}</p>
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p>
              <span className="text-muted-foreground">Name: </span>
              {driver.first_name} {driver.last_name}
            </p>
            <p>
              <span className="text-muted-foreground">Phone Number: </span>
              {driver.phone_number}
            </p>
            <p>
              <span className="text-muted-foreground">Birthday: </span>
              {formatDate(driver.birth_date.toLocaleString())}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <p>
              <span className="text-muted-foreground">Address: </span>
              {driver.address}
            </p>
            <p>
              <span className="text-muted-foreground">
                License Expiration:{' '}
              </span>
              {formatDate(driver.license_expiration.toLocaleString())}
            </p>
          </div>
          <div className="flex flex-col">
            <p>
              <span className="text-muted-foreground">Emergency Name: </span>
              {driver.emergency_contact_name}
            </p>
            <p>
              <span className="text-muted-foreground">Emergency Number: </span>
              {driver.emergency_contact_number}
            </p>
          </div>
          <div className="flex flex-col">
            <p>
              <span className="text-muted-foreground">Recent Attendance: </span>
              {!recent_log?.data.created_at
                ? 'No data avaialble'
                : formatDateTime(recent_log.data.created_at.toLocaleString())}
            </p>
            <p>
              <span className="text-muted-foreground">
                Last Used Tricycle:{' '}
              </span>
              {!recent_log?.data.plate_number
                ? 'No data avaialble'
                : `${recent_log.data.plate_number}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
