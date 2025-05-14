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

export default function TricycleCard({ tricycle }: TricycleProps) {
  const [isPending, startTransition] = useTransition();
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

  return (
    <div className="p-5 flex border-b justify-between items-center">
      <div className="flex items-center lg:gap-4 xl:gap-14">
        <div className="max-w-24 min-w-24">
          {tricycle.status === 'active' && <Badge>Active</Badge>}
          {tricycle.status === 'inactive' && (
            <Badge variant={'destructive'}>Inactive</Badge>
          )}
          {tricycle.status === 'maintenance' && (
            <Badge variant={'secondary'}>Maintenance</Badge>
          )}
        </div>
        <div className="flex flex-col xl:min-w-40 2xl:min-w-72">
          <p className="tracking-wide font-medium whitespace-nowrap">
            <span className="font-normal text-muted-foreground">
              Plate Number:{' '}
            </span>
            {tricycle.plate_number}
          </p>
          <p className="tracking-wide font-medium whitespace-nowrap">
            <span className="font-normal text-muted-foreground">
              Registration Number:{' '}
            </span>
            {tricycle.compliance_details.registration_number}
          </p>
        </div>
        <div className="flex flex-col items-start xl:min-w-40 2xl:min-w-72">
          <p className="tracking-wide text-muted-foreground">
            Vehicle Details:
          </p>
          <div className="flex gap-2">
            <p className="tracking-wide font-medium">
              {tricycle.tricycle_details.year}
            </p>
            <p className="tracking-wide font-medium">
              {tricycle.tricycle_details.model}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start whitespace-nowrap">
          <p className="tracking-wide text-muted-foreground">
            Registration Expiration:
          </p>
          <p className="tracking-wide font-medium">
            {formatDate(tricycle.registration_expiration.toLocaleString())}
          </p>
        </div>
      </div>
      <TricycleCardOptions
        tricycle_id={tricycle.id}
        isPending={isPending}
        onDeleteHandler={onDeleteHandler}
      />
    </div>
  );
}
