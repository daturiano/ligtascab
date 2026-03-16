"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Log, Operator } from "@/lib/types";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AuditLog extends Log {
  operators?: { first_name: string; last_name: string } | null;
  drivers?: { first_name: string; last_name: string } | null;
}

type OperatorWithStatus = Operator & { status?: string; coop_name?: string };

export type AdminRole = "super_admin" | "authority";

const getEventBadge = (event: string) => {
  if (event.includes("create")) {
    return <Badge variant="default">Create</Badge>;
  }
  if (event.includes("update") || event.includes("edit")) {
    return <Badge variant="secondary">Update</Badge>;
  }
  if (event.includes("delete") || event.includes("remove")) {
    return <Badge variant="destructive">Delete</Badge>;
  }
  if (event.includes("suspend")) {
    return <Badge variant="destructive">Suspend</Badge>;
  }
  if (event.includes("unsuspend")) {
    return <Badge variant="default">Unsuspend</Badge>;
  }
  return <Badge variant="outline">{event}</Badge>;
};

const formatEventName = (event: string) => {
  return event
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "log_event",
    header: "Event",
    cell: ({ row }) => (
      <div className="font-medium">
        {formatEventName(row.original.log_event)}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => getEventBadge(row.original.log_event),
  },
  {
    accessorKey: "operator_id",
    header: "Operator",
    cell: ({ row }) =>
      row.original.operators
        ? `${row.original.operators.first_name} ${row.original.operators.last_name}`
        : "-",
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      return row.original.operator_id === filterValue;
    },
  },
  {
    accessorKey: "driver",
    header: "Driver",
    cell: ({ row }) =>
      row.original.drivers
        ? `${row.original.drivers.first_name} ${row.original.drivers.last_name}`
        : "-",
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString(),
  },
];

interface AuditLogsTableProps {
  data: AuditLog[];
  operators: OperatorWithStatus[];
}

export default function AuditLogsTable({
  data,
  operators,
}: AuditLogsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedOperator, setSelectedOperator] = useState<string>("all");

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleOperatorFilter = (value: string) => {
    setSelectedOperator(value);
    if (value === "all") {
      table.getColumn("operator_id")?.setFilterValue(undefined);
    } else {
      table.getColumn("operator_id")?.setFilterValue(value);
    }
    setPagination({ ...pagination, pageIndex: 0 });
  };

  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold">
            System Audit Logs ({filteredCount})
          </h2>
          <Select value={selectedOperator} onValueChange={handleOperatorFilter}>
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Filter by operator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Operators</SelectItem>
              {operators.map((operator) => (
                <SelectItem key={operator.id} value={operator.id}>
                  {operator.coop_name ||
                    `${operator.first_name} ${operator.last_name}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="max-w-full overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              className="h-8 text-xs"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="h-8 text-xs"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
