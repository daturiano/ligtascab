import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";

type ToggleStatusProps = {
  statusSort: string[];
  toggleStatus: (arg: string) => void;
  statusOptions: string[];
};

export default function ToggleStatus({
  statusSort,
  toggleStatus,
  statusOptions,
}: ToggleStatusProps) {
  return (
    <Popover>
      <PopoverTrigger className="bg-card flex cursor-pointer items-center justify-center gap-2 rounded-full border px-2 py-2 text-xs">
        <p className="text-popover-foreground">Status</p>
        <ChevronDown size={14} />
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <Checkbox
              id="all"
              checked={statusSort.includes("all")}
              onCheckedChange={() => toggleStatus("all")}
            />
            <label htmlFor="all" className="text-sm capitalize">
              All
            </label>
          </div>
          {statusOptions.map((status) => (
            <div key={status} className="flex items-center space-x-4">
              <Checkbox
                id={status}
                checked={statusSort.includes(status)}
                onCheckedChange={() => toggleStatus(status)}
              />
              <label
                htmlFor={status}
                className={`text-sm font-medium capitalize`}
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
