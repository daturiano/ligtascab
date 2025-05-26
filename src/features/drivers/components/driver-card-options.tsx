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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import GenerateQRCode from '@/components/view-qr-code';
import OptionsButton from '@/features/tricycles/components/options-button';
import { useMobile } from '@/hooks/useMobile';
import { ChevronDown, Ellipsis, FileText, QrCode, Trash } from 'lucide-react';

type DriverCardOptionsProps = {
  driver_id: string;
  onDeleteHandler: () => void;
  isPending: boolean;
};

export default function DriverCardOptions({
  driver_id,
  onDeleteHandler,
  isPending,
}: DriverCardOptionsProps) {
  const isMobile = useMobile({ max: 960 });

  return (
    <div className="flex items-center gap-2 lg:gap-2 w-full lg:w-auto justify-between">
      <GenerateQRCode id={driver_id}>
        <OptionsButton>
          {isMobile ? (
            <p className="text-xs whitespace-nowrap md:text-sm">QR Code</p>
          ) : (
            <QrCode size={20} />
          )}
        </OptionsButton>
      </GenerateQRCode>
      <OptionsButton>
        {isMobile ? (
          <p className="text-xs md:text-sm">Documents</p>
        ) : (
          <div className="py-4 px-2.5 flex items-center justify-center">
            <FileText size={20} />
          </div>
        )}
      </OptionsButton>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full">
          <OptionsButton>
            {isMobile ? (
              <div className="flex items-center gap-1">
                <p className="text-xs md:text-sm">Options</p>
                <ChevronDown size={14} />
              </div>
            ) : (
              <Ellipsis size={20} />
            )}
          </OptionsButton>
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
  );
}
