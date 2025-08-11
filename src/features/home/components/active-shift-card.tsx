import { useElapsedTime } from "@/hooks/useElapsedTime";
import { ShiftLog } from "@/lib/types";
import { extractTime } from "@/lib/utils";
import { UsersRound } from "lucide-react";

type ActiveShiftCardProps = {
  shift: ShiftLog;
};

export default function ActiveShiftCard({ shift }: ActiveShiftCardProps) {
  const duration = useElapsedTime(shift.created_at);
  return (
    <div className="bg-background flex w-full justify-between rounded-md p-3">
      <div className="flex flex-row items-center gap-4">
        <div className="bg-primary/20 flex size-12 items-center justify-center rounded-4xl">
          <UsersRound size={20} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm">{shift.driver_name}</p>
          <p className="text-muted-foreground text-sm">{shift.plate_number}</p>
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
