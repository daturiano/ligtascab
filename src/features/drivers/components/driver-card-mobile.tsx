import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Driver } from '@/lib/types';
import { formatDate, getErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { removeDriverFromOperator } from '../actions/drivers';
import DriverCardOptions from './driver-card-options';

type DriverCardMobileProps = {
  driver: Driver;
};

export default function DriverCardMobile({ driver }: DriverCardMobileProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (driver: Driver) => {
      const result = await removeDriverFromOperator(driver);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: (deletedDriver) => {
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success(
        `${deletedDriver.first_name} ${deletedDriver.last_name} successfully removed from your drivers.`
      );
    },
    onError: (err) => {
      console.error(getErrorMessage(err));
      toast.error('Something went wrong');
    },
  });

  const handleDelete = async () => {
    deleteMutation.mutate(driver);
  };
  return (
    <div className="p-4 flex flex-col gap-4 border-b w-full">
      <div className="flex gap-2 items-center">
        <Avatar className="size-14 rounded-md">
          <AvatarImage
            src={driver.image ?? undefined}
            alt={driver.first_name}
          />
          <AvatarFallback className="size-14 border-1 border-white rounded-md bg-gray-300 flex items-center justify-center">
            <p>{driver.first_name.charAt(0).toUpperCase()}</p>
            <p>{driver.last_name.charAt(0).toUpperCase()}</p>
          </AvatarFallback>
        </Avatar>
        <div className="flex-col text-xs md:text-sm space-y-1">
          <p>
            <span className="tracking-wide text-muted-foreground">
              Name: {'  '}
            </span>
            {`${driver.first_name} ${driver.last_name}`}
          </p>
          <p>
            <span className="font-normal text-muted-foreground">
              Phone Number:{' '}
            </span>
            {driver.phone_number}
          </p>
          <p>
            <span className="tracking-wide text-muted-foreground">
              License Expiration: {'  '}
            </span>
            {formatDate(driver.license_expiration.toLocaleString())}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <DriverCardOptions
          driver={driver}
          isDeleting={deleteMutation.isPending}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
