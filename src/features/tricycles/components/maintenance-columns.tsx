'use client';

import { MaintenanceRecords } from '@/lib/types';
import { capitalizeFirstLetter, formatDate } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

export const maintenance_columns: ColumnDef<MaintenanceRecords>[] = [
  {
    accessorKey: 'plate_number',
    header: () => <div className="ml-4">Plate Number</div>,
    cell: ({ row }) => {
      return (
        <Link
          href={`/tricycles/${row.original.tricycle_id}`}
          className="hover:text-blue-500 hover:underline ml-4"
        >
          {row.getValue('plate_number')}
        </Link>
      );
    },
  },
  {
    accessorKey: 'issue_description',
    header: 'Issue Description',
  },
  {
    accessorKey: 'service_performed',
    header: 'Service Performed',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      return <div>{capitalizeFirstLetter(row.getValue('type'))}</div>;
    },
  },
  {
    accessorKey: 'cost',
    header: 'Cost',
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const formattedDate = formatDate(row.getValue('date'));
      return <div>{formattedDate}</div>;
    },
  },
];
