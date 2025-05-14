import { Badge } from '@/components/ui/badge';
import { Tricycle } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { removeTricycleFromOperator } from '../actions/tricycles';
import TricycleCardOptions from './tricycle-card-options';

type TricycleProps = {
  tricycle: Tricycle;
};

export default function TricycleCardMobile({ tricycle }: TricycleProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: removeTricycleFromOperator,
  });

  const onDeleteHandler = async () => {
    startTransition(() => {
      deleteMutation.mutate(tricycle.id, {
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

  return (
    <div className="p-4 flex flex-col gap-4 border-b w-full">
      <div className="space-y-2">
        {tricycle.status === 'active' && (
          <Badge className="md:py-2 md:text-sm">
            Active: {tricycle.plate_number}
          </Badge>
        )}
        {tricycle.status === 'inactive' && (
          <Badge variant={'secondary'} className="md:py-2 md:text-sm">
            Inactive: {tricycle.plate_number}
          </Badge>
        )}
        {tricycle.status === 'maintenance' && (
          <Badge
            variant={'destructive'}
            className="bg-destructive/60 md:py-2 md:text-sm"
          >
            Under Maintenance: {tricycle.plate_number}
          </Badge>
        )}
        <TricycleCardOptions
          tricycle_id={tricycle.id}
          isPending={isPending}
          onDeleteHandler={onDeleteHandler}
        />
      </div>
      <div className="flex-col text-xs md:text-sm space-y-1">
        <p>
          <span className="tracking-wide text-muted-foreground">
            Vehicle Details: {'  '}
          </span>
          {tricycle.tricycle_details.year} {tricycle.tricycle_details.model}
        </p>
        <p>
          <span className="font-normal text-muted-foreground">
            Registration Number:{' '}
          </span>
          {tricycle.compliance_details.registration_number}
        </p>
        <p>
          <span className="tracking-wide text-muted-foreground">
            Vehicle Registration Expiration: {'  '}
          </span>
          {formatDate(tricycle.registration_expiration.toLocaleString())}
        </p>
      </div>
    </div>
  );
}
