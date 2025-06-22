import tricycleimg from '@/app/public/tricycle.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tricycle } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import {
  Calendar,
  CalendarSync,
  CalendarX,
  Container,
  Fuel,
  Hash,
  Text,
  Users,
} from 'lucide-react';
import Image from 'next/image';

type TricycleProfileCardProps = {
  tricycle: Tricycle;
};

export default function TricycleProfileCard({
  tricycle,
}: TricycleProfileCardProps) {
  return (
    <Card className="py-0 w-full max-w-[500px]">
      <CardHeader className="w-full relative flex flex-col items-center justify-center bg-muted-foreground/5 rounded-t-xl py-4">
        <CardTitle>
          <div className="relative">
            <Avatar className="size-36 rounded-full">
              <AvatarImage
                src={tricycle?.image ?? undefined}
                alt={tricycle?.image ?? undefined}
              />
              <AvatarFallback className="size-36 border-1 border-white rounded-full bg-gray-300 flex items-center justify-center text-2xl font-medium">
                <Image
                  src={tricycleimg}
                  alt="tricycle image"
                  width={60}
                  height={60}
                />
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-1.5 right-1.5 h-8 w-8 rounded-full ${
                tricycle.status === 'active' ? 'bg-primary' : 'bg-destructive'
              }`}
            ></div>
          </div>
        </CardTitle>
        <CardDescription>
          <p className="text-lg text-black">{tricycle.plate_number}</p>
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold">Tricycle Details</h1>
          <div className="flex gap-2 items-center">
            <Container className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">Model: </p>
            <p className="whitespace-nowrap truncate">
              {tricycle.tricycle_details.model} {tricycle.tricycle_details.year}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Fuel className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Fuel Type:{' '}
            </p>
            <p>{tricycle.tricycle_details.fuel_type}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Users className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Seating Capacity:{' '}
            </p>
            <p>{tricycle.tricycle_details.seating_capacity}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold">Compliance Details</h1>
          <div className="flex gap-2 items-center">
            <Hash className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Franchise Number:{' '}
            </p>
            <p className="whitespace-nowrap truncate">
              {tricycle.compliance_details.franchise_number}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <CalendarSync className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Franchise Expiration:{' '}
            </p>
            <p className="whitespace-nowrap truncate">
              {formatDate(
                tricycle.franchise_expiration.toLocaleString(),
                'long'
              )}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Text className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Registration Number:{' '}
            </p>
            <p className="whitespace-nowrap truncate">
              {tricycle.compliance_details.registration_number}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <CalendarX className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Registration Expiration:{' '}
            </p>
            <p className="whitespace-nowrap truncate">
              {formatDate(
                tricycle.registration_expiration.toLocaleString(),
                'long'
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-semibold">Maintenance Details</h1>
          <div className="flex gap-2 items-center">
            <Calendar className="text-muted-foreground" size={18} />
            <p className="whitespace-nowrap text-muted-foreground">
              Last Maintenance Date:{' '}
            </p>
            <p className="whitespace-nowrap truncate">
              {formatDate(
                tricycle.last_maintenance_date.toLocaleString(),
                'long'
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
