import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import placeholder from '@/app/public/pictures.png';
import { formatDate } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { removeDriverFromOperator } from '../actions/drivers';
import DriverCardOptions from './driver-card-options';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Driver } from '@/lib/types';

type DriverInformationProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

type DriversProps = {
  driver: Driver;
};

function DriverInformation({
  title,
  description,
  children,
}: DriverInformationProps) {
  return (
    <>
      {!children ? (
        <p className="tracking-wide font-medium whitespace-nowrap text-base">
          <span className="font-normal text-muted-foreground">{title}: </span>
          {description}
        </p>
      ) : (
        <div className="flex whitespace-nowrap">
          <p className="font-normal text-muted-foreground mr-1">{title}:</p>
          {children}
        </div>
      )}
    </>
  );
}

export default function DriverCard({ driver }: DriversProps) {
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: removeDriverFromOperator,
  });

  const onDeleteHandler = async () => {
    startTransition(() => {
      deleteMutation.mutate(driver.id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['drivers'],
          });
          toast.success('Driver deleted successfully!');
        },
        onError: () => {
          toast.error('Error deleting driver.');
        },
      });
    });
  };

  const DriverStatus = () => {
    if (driver.status == 'active') return <Badge>Active</Badge>;
    if (driver.status == 'inactive')
      return <Badge variant={'outline'}>Inactive</Badge>;
  };

  return (
    <div
      className="p-5 gap-8 flex items-center border-b hover:bg-background/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className="size-40 rounded-md">
        <AvatarImage src={driver.image ?? undefined} alt={driver.first_name} />
        <AvatarFallback className="size-40 border-1 border-white bg-gray-200 rounded-md">
          <Image
            src={placeholder}
            alt="placeholder image"
            width={42}
            height={42}
          />
        </AvatarFallback>
      </Avatar>
      <div className="w-full flex flex-col justify-between gap-2">
        <div className="flex justify-between items-center">
          <div className="max-w-24 min-w-24">
            <DriverStatus />
          </div>
          <DriverCardOptions
            driver_id={driver.id}
            isPending={isPending}
            isHovered={isHovered}
            onDeleteHandler={onDeleteHandler}
          />
        </div>
        <div className="flex justify-between">
          <div className="space-y-1">
            <DriverInformation
              title="Name"
              description={driver.first_name + ' ' + driver.last_name}
            />
            <DriverInformation
              title="Phone Number"
              description={driver.phone_number}
            />
            <DriverInformation title="License Expiration">
              <p className="tracking-wide font-medium">
                {formatDate(driver.license_expiration.toLocaleString(), 'long')}
              </p>
            </DriverInformation>
            <DriverInformation
              title="Most Recent Tricycle"
              description="NGA 0239"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
