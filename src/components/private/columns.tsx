"use client";

import { Badge } from "@/components/ui/badge";
import { ShiftLog } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<ShiftLog>[] = [
  {
    accessorKey: "shift_type",
    header: () => <div className="ml-4">Status</div>,
    cell: ({ row }) => {
      const type = row.getValue("shift_type") as string;
      return (
        <div className="mr-4 ml-2">
          {type === "Time-in" ? (
            <Badge className="bg-primary w-full">{type}</Badge>
          ) : (
            <Badge variant={"secondary"} className="w-full">
              {type}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div>Time & Date</div>,
    cell: ({ row }) => {
      const formattedDate = formatDateTime(row.getValue("created_at"), true);
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: "driver_name",
    header: () => <div>Driver Name</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`/drivers/${row.original.driver_id}`}
          className="hover:text-blue-500 hover:underline"
        >
          {row.getValue("driver_name")}
        </Link>
      );
    },
  },
  {
    accessorKey: "plate_number",
    header: () => <div>Plate Number</div>,
  },
];
