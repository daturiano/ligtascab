import { useElapsedTime } from '@/hooks/useElapsedTime';
import { ShiftLog } from '@/lib/types';
import { extractTime } from '@/lib/utils';
import { UsersRound } from 'lucide-react';

type ActiveShiftCardProps = {
  shift: ShiftLog;
};

export default function ActiveShiftCard({ shift }: ActiveShiftCardProps) {
  const duration = useElapsedTime(shift.created_at);
  return (
    <div className="bg-background w-full p-3 rounded-md flex justify-between">
      <div className="flex flex-row gap-4 items-center">
        <div className="size-12 flex items-center justify-center bg-primary/20 rounded-4xl">
          <UsersRound size={20} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">{shift.driver_name}</p>
          <p className="text-sm text-muted-foreground">{shift.plate_number}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-end">
        <p className="text-sm">{duration}</p>
        <p className="text-muted-foreground text-sm">
          Started {extractTime(shift.created_at)}
        </p>
      </div>
    </div>
  );
}
