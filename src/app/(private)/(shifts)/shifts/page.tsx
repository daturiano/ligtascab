"use client";

import { columns } from "@/components/private/columns";
import SkeletonPage from "@/components/private/page-skeleton";
import { fetchAllShiftLogs } from "@/features/shifts/actions/shifts";
import { ShiftLog } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import dynamic from "next/dynamic";

const QRReaderCard = dynamic(
  () => import("@/features/shifts/components/qr-reader-card"),
  { ssr: false },
);

const ShiftTable = dynamic<{
  data: ShiftLog[];
  columns: ColumnDef<ShiftLog, unknown>[];
  filter_by: string;
}>(
  () =>
    import("@/features/shifts/components/shift-table").then(
      (mod) => mod.ShiftTable,
    ),
  { ssr: false },
);

export default function ShiftPage() {
  const { data: shift_logs, isLoading } = useQuery({
    queryKey: ["shift_logs"],
    queryFn: fetchAllShiftLogs,
  });

  if (isLoading) return <SkeletonPage />;

  return (
    <div className="mx-auto mb-12 gap-4 space-y-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Shifts</h1>
        <div className="flex flex-col gap-6 lg:flex-row">
          <QRReaderCard />
          <ShiftTable
            data={shift_logs ?? []}
            columns={columns}
            filter_by="driver_name"
          />
        </div>
      </div>
    </div>
  );
}
