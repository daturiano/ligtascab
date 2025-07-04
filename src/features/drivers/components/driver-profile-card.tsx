'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Cake,
  CalendarX,
  IdCard,
  MapPinHouse,
  Phone,
  PhoneForwarded,
  User,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Driver } from '@/lib/types';
import Link from 'next/link';

type DriverProfileCardProps = {
  driver: Driver;
};

export default function DriverProfileCard({ driver }: DriverProfileCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  return (
    <Card
      className="py-0 w-full xl:min-w-[410px] xl:max-w-[410px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="w-full relative flex flex-col items-center justify-center bg-muted-foreground/5 rounded-t-xl py-4">
        <div className="absolute top-0 right-0 p-4">
          {isHovered && (
            <div className="absolute top-0 right-0 p-4">
              <Link href={`/drivers/${driver.id}/edit-profile`}>
                <Button variant={'outline'}>Edit Profile</Button>
              </Link>
            </div>
          )}
        </div>
        <CardTitle>
          <div className="relative">
            <Avatar className="size-36 rounded-full">
              <AvatarImage
                src={driver?.image ?? undefined}
                alt={driver?.first_name ?? undefined}
              />
              <AvatarFallback className="size-36 border-1 border-white rounded-full bg-gray-300 flex items-center justify-center text-2xl font-medium">
                <p>
                  {driver.first_name.charAt(0).toUpperCase()}
                  {driver.last_name.charAt(0).toUpperCase()}
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
      <CardContent className="pb-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold">Driver Details</h1>
          <div className="flex gap-2 items-center">
            <MapPinHouse className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">Address: </p>
            <p className="whitespace-nowrap truncate">{driver.address}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Phone className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Phone Number:{' '}
            </p>
            <p>{driver.phone_number}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Cake className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Birthday:{' '}
            </p>
            <p>{formatDate(driver.birth_date.toLocaleString(), 'long')}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold">License Details</h1>
          <div className="flex gap-2 items-center">
            <IdCard className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              License Number:{' '}
            </p>
            <p className="whitespace-nowrap truncate">
              {driver.license_number}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <CalendarX className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              License Expiration:{' '}
            </p>
            <p className="whitespace-nowrap truncate">
              {formatDate(driver.license_expiration.toLocaleString(), 'long')}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold">Emergency Details</h1>
          <div className="flex gap-2 items-center">
            <User className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Contact Name:{' '}
            </p>
            <p>{driver.emergency_contact_name}</p>
          </div>
          <div className="flex gap-2 items-center">
            <PhoneForwarded className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Contact Number:{' '}
            </p>
            <p>{driver.emergency_contact_number}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
