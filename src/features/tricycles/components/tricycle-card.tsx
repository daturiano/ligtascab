import placeholder from '@/app/public/pictures.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tricycle } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { removeTricycleFromOperator } from '../actions/tricycles';
import TricycleCardOptions from './tricycle-card-options';

type TricycleInformationProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

type TricycleProps = {
  tricycle: Tricycle;
};

function TricycleInformation({
  title,
  description,
  children,
}: TricycleInformationProps) {
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

export default function TricycleCard({ tricycle }: TricycleProps) {
  const [isPending, startTransition] = useTransition();
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: removeTricycleFromOperator,
  });

  const onDeleteHandler = async () => {
    startTransition(() => {
      deleteMutation.mutate(tricycle.id!, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['tricycles'],
          });
          toast.success('Tricycle deleted successfully!');
        },
        onError: () => {
          toast.error('Error deleting tricycle.');
        },
      });
    });
  };

  const TricycleStatus = () => {
    if (tricycle.status == 'active') return <Badge>Active</Badge>;
    if (tricycle.status == 'inactive')
      return <Badge variant={'outline'}>Inactive</Badge>;
    if (tricycle.status == 'maintenance')
      return <Badge variant={'secondary'}>In Maintenance</Badge>;
  };

  return (
    <div
      className="p-5 gap-8 flex items-center border-b hover:bg-background/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className="size-40 rounded-md">
        <AvatarImage
          src={tricycle.image ?? undefined}
          alt={tricycle.plate_number}
        />
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
            <TricycleStatus />
          </div>
          <TricycleCardOptions
            tricycle_id={tricycle.id}
            isHovered={isHovered}
            isPending={isPending}
            onDeleteHandler={onDeleteHandler}
          />
        </div>
        <div className="flex justify-between">
          <div className="space-y-1">
            <TricycleInformation
              title="Plate Number"
              description={tricycle.plate_number}
            />
            <TricycleInformation
              title="Franchise Number"
              description={tricycle.compliance_details.franchise_number}
            />
            <TricycleInformation title="Registration Expiration">
              <p className="tracking-wide font-medium">
                {formatDate(
                  tricycle.franchise_expiration.toLocaleString(),
                  'long'
                )}
              </p>
            </TricycleInformation>
            <TricycleInformation
              title="Most Recent Driver"
              description="Daniel Joshua Turiano"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
