'use client';

import { Badge } from '@/components/ui/badge';
import { ShiftLog } from '@/lib/types';
import { formatDateTime } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const columns: ColumnDef<ShiftLog>[] = [
  {
    accessorKey: 'shift_type',
    header: () => <div className="ml-4">Status</div>,
    cell: ({ row }) => {
      const type = row.getValue('shift_type') as string;
      return (
        <div className="ml-2 mr-4">
          {type === 'Time-in' ? (
            <Badge>{type}</Badge>
          ) : (
            <Badge variant={'outline'} className="w-full">
              {type}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: () => <div>Time & Date</div>,
    cell: ({ row }) => {
      const formattedDate = formatDateTime(row.getValue('created_at'));
      return <div>{formattedDate}</div>;
    },
  },
  {
    accessorKey: 'driver_name',
    header: 'Full name',
    cell: ({ row }) => {
      return (
        <Link
          href={`/drivers/${row.original.driver_id}`}
          className="hover:text-blue-500 hover:underline"
        >
          {row.getValue('driver_name')}
        </Link>
      );
    },
  },
  {
    accessorKey: 'plate_number',
    header: 'Plate Number',
  },
];
