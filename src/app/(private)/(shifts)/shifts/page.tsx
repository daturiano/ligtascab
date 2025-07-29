'use client';

import { columns } from '@/components/private/columns';
import SkeletonPage from '@/components/private/page-skeleton';
import { fetchAllShiftLogs } from '@/features/shifts/actions/shifts';
import QRReaderCard from '@/features/shifts/components/qr-reader-card';
import { ShiftTable } from '@/features/shifts/components/shift-table';
import { useQuery } from '@tanstack/react-query';

export default function ShiftPage() {
  const { data: shift_logs, isLoading } = useQuery({
    queryKey: ['shift_logs'],
    queryFn: fetchAllShiftLogs,
  });

  if (isLoading) return <SkeletonPage />;

  return (
    <div className="space-y-4 gap-4 mx-auto mb-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold">Shifts</h1>
        <div className="flex flex-col lg:flex-row gap-6">
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
