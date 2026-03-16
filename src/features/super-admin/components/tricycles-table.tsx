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
import { Tricycle, Operator } from "@/lib/types";
import { Eye } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type TricycleWithOperator = Tricycle & {
  operators?: { first_name: string; last_name: string } | null;
};

type OperatorWithStatus = Operator & { status?: string; coop_name?: string };

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default">Active</Badge>;
    case "inactive":
      return <Badge variant="secondary">Inactive</Badge>;
    case "suspended":
      return <Badge variant="destructive">Suspended</Badge>;
    default:
      return <Badge variant="secondary">{status || "Unknown"}</Badge>;
  }
};

const columns: ColumnDef<TricycleWithOperator>[] = [
  {
    accessorKey: "plate_number",
    header: "Plate Number",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.plate_number}</div>
    ),
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
    accessorKey: "model",
    header: "Model",
    cell: ({ row }) => row.original.tricycle_details?.model || "-",
  },
  {
    accessorKey: "body_number",
    header: "Body #",
    cell: ({ row }) => row.original.tricycle_details?.body_number || "-",
  },
  {
    accessorKey: "registration_expiration",
    header: "Reg. Exp.",
    cell: ({ row }) =>
      row.original.registration_expiration
        ? new Date(row.original.registration_expiration).toLocaleDateString()
        : "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/super-admin/tricycles/${row.original.id}`}>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
    ),
  },
];

interface TricyclesTableProps {
  data: TricycleWithOperator[];
  operators: OperatorWithStatus[];
}

export default function TricyclesTable({
  data,
  operators,
}: TricyclesTableProps) {
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
            All Tricycles ({filteredCount})
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
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No tricycles found.
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
