"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { updateReportStatusAction } from "../actions/authority";

interface ReportsTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
}

export default function ReportsTable({ data }: ReportsTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      await updateReportStatusAction(id, newStatus);
      toast.success("Report status updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="bg-card rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket #</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Commuter</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No reports found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  {report.ticket_number}
                </TableCell>
                <TableCell>
                  {format(new Date(report.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{report.type}</Badge>
                </TableCell>
                <TableCell
                  className="max-w-[300px] truncate"
                  title={report.description}
                >
                  {report.description}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {report.commuters?.first_name}{" "}
                      {report.commuters?.last_name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {report.commuters?.phone_number}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    disabled={updatingId === report.id}
                    defaultValue={report.report_status}
                    onValueChange={(value) =>
                      handleStatusChange(report.id, value)
                    }
                  >
                    <SelectTrigger className="h-8 w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
