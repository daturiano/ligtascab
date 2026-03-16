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
import { Badge } from "@/components/ui/badge";
import { Operator } from "@/lib/types";
import { Eye, Ban, CheckCircle } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  suspendUserAction,
  unsuspendUserAction,
} from "../actions/user-management";
import { getErrorMessage, getFormattedDate } from "@/lib/utils";

type OperatorWithStatus = Operator & { status?: string };

export type AdminRole = "super_admin" | "authority";

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default">Active</Badge>;
    case "suspended":
      return <Badge variant="destructive">Suspended</Badge>;
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "rejected":
      return <Badge variant="outline">Rejected</Badge>;
    default:
      return <Badge variant="secondary">{status || "Unknown"}</Badge>;
  }
};

function ActionCell({
  operator,
  role,
  suspendAction,
  unsuspendAction,
}: {
  operator: OperatorWithStatus;
  role: AdminRole;
  suspendAction: (data: { userId: string }) => Promise<{ error: unknown }>;
  unsuspendAction: (userId: string) => Promise<{ error: unknown }>;
}) {
  const [loading, setLoading] = useState(false);
  const basePath = role === "super_admin" ? "/super-admin" : "/authority";

  const handleSuspend = async () => {
    setLoading(true);
    try {
      const { error } = await suspendAction({ userId: operator.id });
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success("User suspended successfully");
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { description: getFormattedDate() });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    setLoading(true);
    try {
      const { error } = await unsuspendAction(operator.id);
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success("User unsuspended successfully");
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { description: getFormattedDate() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`${basePath}/operators/${operator.id}`}>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      {operator.status === "suspended" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleUnsuspend}
          disabled={loading}
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSuspend}
          disabled={loading}
        >
          <Ban className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

const getColumns = (
  role: AdminRole,
  suspendAction: (data: { userId: string }) => Promise<{ error: unknown }>,
  unsuspendAction: (userId: string) => Promise<{ error: unknown }>
): ColumnDef<OperatorWithStatus>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.first_name} {row.original.last_name}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email || "-",
  },
  {
    accessorKey: "phone_number",
    header: "Phone",
    cell: ({ row }) => row.original.phone_number || "-",
  },
  {
    accessorKey: "coop_name",
    header: "Coop",
    cell: ({ row }) => row.original.coop_name || "-",
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
      <ActionCell
        operator={row.original}
        role={role}
        suspendAction={suspendAction}
        unsuspendAction={unsuspendAction}
      />
    ),
  },
];

interface OperatorsTableProps {
  data: OperatorWithStatus[];
  role?: AdminRole;
  suspendAction?: (data: { userId: string }) => Promise<{ error: unknown }>;
  unsuspendAction?: (userId: string) => Promise<{ error: unknown }>;
}

export default function OperatorsTable({
  data,
  role = "super_admin",
  suspendAction = suspendUserAction,
  unsuspendAction = unsuspendUserAction,
}: OperatorsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = getColumns(role, suspendAction, unsuspendAction);

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

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
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
                    No operators found.
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
