import GenerateQRCode from '@/components/generate-qrcode';
import { Badge } from '@/components/ui/badge';
import { Tricycle } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Ellipsis, FileText } from 'lucide-react';

type TricycleProps = {
  tricycle: Tricycle;
};

export default function TricycleCard({ tricycle }: TricycleProps) {
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
            {tricycle.registration_number}
          </p>
        </div>
      </div>
      <div className="flex gap-16">
        <div className="flex flex-col items-start min-w-56">
          <p className="tracking-wide text-muted-foreground">
            Vehicle Details:
          </p>
          <div className="flex gap-2">
            <p className="tracking-wide font-medium">{tricycle.year}</p>
            <p className="tracking-wide font-medium">{tricycle.model}</p>
          </div>
        </div>
        <div className="flex flex-col items-start min-w-56">
          <p className="tracking-wide text-muted-foreground">
            Vehicle Registration Expiration:
          </p>
          <p className="tracking-wide font-medium">
            {formatDate(tricycle.registration_expiry.toLocaleString())}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <GenerateQRCode id={tricycle.id} />
        <button className="cursor-pointer rounded-full size-10 flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/15">
          <FileText size={20} />
        </button>
        <button className="cursor-pointer rounded-full size-10 flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/15">
          <Ellipsis size={20} />
        </button>
      </div>
    </div>
  );
}
