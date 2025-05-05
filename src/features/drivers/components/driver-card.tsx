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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Ellipsis, FileText, Trash, User } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { removeDriverFromOperator } from '../actions/drivers';
import { Driver } from '../schemas/drivers';

type DriversProps = {
  driver: Driver;
};

export default function DriverCard({ driver }: DriversProps) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: removeDriverFromOperator,
  });

  const onDeleteHandler = async () => {
    startTransition(() => {
      deleteMutation.mutate(driver.license_number, {
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

  return (
    <div className="p-5 flex border-b justify-between items-start">
      <div className="flex items-start gap-4 min-w-[250px]">
        <div className="relative">
          <Avatar className="size-10 rounded-full">
            {/* <AvatarImage
              src={driver?.image ?? undefined}
              alt={driver?.first_name ?? undefined}
            /> */}
            <AvatarFallback className="size-10 border-1 border-white rounded-full bg-gray-300 flex items-center justify-center text-md font-medium">
              <p>
                {driver?.first_name.charAt(0).toUpperCase()}
                {driver?.last_name.charAt(0).toUpperCase()}
              </p>
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full ${
              driver.status === 'active' ? 'bg-primary' : 'bg-destructive'
            }`}
          ></div>
        </div>

        <div className="flex flex-col text-md">
          <p className="tracking-wide font-medium">
            <span className="font-normal text-muted-foreground">Name: </span>
            {driver.first_name} {driver.last_name}
          </p>
          <p className="tracking-wide font-medium">
            <span className="font-normal text-muted-foreground">
              Phone Number:{' '}
            </span>
            {driver.phone_number}
          </p>
        </div>
      </div>

      <div className="text-md min-w-[400px]">
        <p className="tracking-wide text-start">
          <span className="text-muted-foreground">Address: </span>
          {driver.address}
        </p>
      </div>

      <div className="flex flex-col text-md min-w-[250px]">
        <p className="tracking-wide text-muted-foreground">
          Driver&apos;s License Expiration:
        </p>
        <p className="tracking-wide font-medium">
          {formatDate(driver.license_expiration.toLocaleString())}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <GenerateQRCode id={driver.license_number} />
        <button className="cursor-pointer rounded-full size-10 flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/15">
          <FileText size={20} />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer rounded-full size-10 flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/15">
            <Ellipsis size={20} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-36">
            <DropdownMenuLabel>Driver Options</DropdownMenuLabel>
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
                      your driver and remove the data from our servers.
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
            <DropdownMenuItem asChild>
              <Link
                href={`/drivers/${driver.id}`}
                className="flex gap-2 items-center"
              >
                <User size={16} strokeWidth={2} />
                <p className="text-sm">View Profile</p>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
