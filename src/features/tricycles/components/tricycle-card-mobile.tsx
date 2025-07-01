import { Badge } from '@/components/ui/badge';
import { Tricycle } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { removeTricycleFromOperator } from '../actions/tricycles';
import TricycleCardOptions from './tricycle-card-options';

type TricycleProps = {
  tricycle: Tricycle;
};

export default function TricycleCardMobile({ tricycle }: TricycleProps) {
  const queryClient = useQueryClient();

  const deleteTricycleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await removeTricycleFromOperator(id);
      return data;
    },
    onSuccess: (deletedTricycle) => {
      queryClient.invalidateQueries({
        queryKey: ['tricycles'],
      });
      toast.success(`${deletedTricycle.plate_number} deleted successfully!`);
    },
    onError: () => {
      toast.error('Unable to delete tricycle.');
    },
  });

  const onDeleteHandler = async () => {
    deleteTricycleMutation.mutate(tricycle.id);
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
          isPending={deleteTricycleMutation.isPending}
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
