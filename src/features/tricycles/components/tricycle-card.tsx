import GenerateQRCode from '@/components/generate-qrcode';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDate } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ellipsis, FileText, Trash } from 'lucide-react';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { removeTricycleFromOperator } from '../actions/tricycles';
import { Tricycle } from '@/lib/types';

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
      <div className="flex items-center gap-16">
        <div className="min-w-[6rem]">
          {tricycle.status === 'active' && <Badge>Active</Badge>}
          {tricycle.status === 'inactive' && (
            <Badge variant={'destructive'}>Inactive</Badge>
          )}
          {tricycle.status === 'maintenance' && (
            <Badge variant={'secondary'}>Maintenance</Badge>
          )}
        </div>
        <div className="flex flex-col">
          <p className="tracking-wide font-medium">
            <span className="font-normal text-muted-foreground">
              Plate Number:{' '}
            </span>
            {tricycle.plate_number}
          </p>
          <p className="tracking-wide font-medium">
            <span className="font-normal text-muted-foreground">
              Registration Number:{' '}
            </span>
            {tricycle.compliance_details.registration_number}
          </p>
        </div>
      </div>
      <div className="flex gap-16">
        <div className="flex flex-col items-start min-w-56">
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
        <div className="flex flex-col items-start min-w-56">
          <p className="tracking-wide text-muted-foreground">
            Vehicle Registration Expiration:
          </p>
          <p className="tracking-wide font-medium">
            {formatDate(tricycle.registration_expiration.toLocaleString())}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {tricycle.id && <GenerateQRCode id={tricycle.id} />}
        <button className="cursor-pointer rounded-full size-10 flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/15">
          <FileText size={20} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-full size-10 flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/15">
            <Ellipsis size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-36">
            <DropdownMenuLabel>Tricycle Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AlertDialog>
                <AlertDialogTrigger
                  asChild
                  className="p-2 hover:bg-destructive/10 cursor-pointer"
                >
                  <div className="flex gap-2 items-center">
                    <Trash size={16} />
                    <p className="text-sm">Delete</p>
                  </div>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your tricycle and remove the data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDeleteHandler}
                      disabled={isPending}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
