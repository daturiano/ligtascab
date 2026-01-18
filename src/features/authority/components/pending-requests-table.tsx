"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PendingRequest } from "@/lib/types";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface PendingRequestsTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: (PendingRequest & { requester: { email: string } | any })[];
}

export default function PendingRequestsTable({
  data,
}: PendingRequestsTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Applicant</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No pending requests found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {request.payload?.first_name} {request.payload?.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {request.payload?.email || "No email"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  {request.action_type.replace("_", " ")}
                </TableCell>
                <TableCell>
                  {new Date(request.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/authority/request/${request.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" /> Review
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}