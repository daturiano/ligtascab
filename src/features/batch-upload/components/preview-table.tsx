"use client";

import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RowValidationResult } from "../schemas/batch-upload";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PreviewTableProps<T> {
  rows: RowValidationResult<T>[];
  columns: Array<{ key: keyof T; label: string }>;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function PreviewTable<T extends Record<string, unknown>>({
  rows,
  columns,
  onConfirm,
  onCancel,
  isLoading = false,
}: PreviewTableProps<T>) {
  const validCount = rows.filter((r) => r.isValid && !r.isDuplicate).length;
  const invalidCount = rows.filter((r) => !r.isValid).length;
  const duplicateCount = rows.filter((r) => r.isDuplicate).length;

  const formatCellValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    return String(value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="font-medium">{validCount} valid</span>
          </div>
          {invalidCount > 0 && (
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="font-medium">{invalidCount} invalid</span>
            </div>
          )}
          {duplicateCount > 0 && (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">{duplicateCount} duplicates</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Row</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                {columns.map((col) => (
                  <TableHead key={String(col.key)}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.rowIndex}
                  className={
                    !row.isValid
                      ? "bg-destructive/5"
                      : row.isDuplicate
                        ? "bg-yellow-500/5"
                        : ""
                  }
                >
                  <TableCell className="font-mono">{row.rowIndex}</TableCell>
                  <TableCell>
                    {row.isDuplicate ? (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        Duplicate
                      </Badge>
                    ) : row.isValid ? (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        Valid
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Invalid</Badge>
                    )}
                  </TableCell>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)} className="max-w-[200px] truncate">
                      {row.data
                        ? formatCellValue(row.data[col.key])
                        : "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {invalidCount > 0 && (
          <div className="border-t p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="errors" className="border-none">
                <AccordionTrigger className="py-2 text-sm">
                  View validation errors
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 text-sm">
                    {rows
                      .filter((r) => !r.isValid)
                      .map((row) => (
                        <li key={row.rowIndex} className="text-destructive">
                          <span className="font-medium">Row {row.rowIndex}:</span>{" "}
                          {row.errors.join(", ")}
                        </li>
                      ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={validCount === 0 || isLoading}
        >
          {isLoading ? "Importing..." : `Import ${validCount} Records`}
        </Button>
      </CardFooter>
    </Card>
  );
}
