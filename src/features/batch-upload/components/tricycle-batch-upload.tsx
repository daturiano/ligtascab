"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CSVDropzone from "./csv-dropzone";
import PreviewTable from "./preview-table";
import ImportSummary from "./import-summary";
import { parseCSV, parseDate } from "../utils/csv-parser";
import {
  TricycleCSVRowSchema,
  RowValidationResult,
  TricycleCSVRow,
  BatchCreateResult,
} from "../schemas/batch-upload";
import {
  checkExistingTricycles,
  batchCreateTricycles,
} from "../actions/batch-upload";

type UploadState = "idle" | "parsing" | "previewing" | "importing" | "complete";

const TRICYCLE_COLUMNS: Array<{ key: keyof TricycleCSVRow; label: string }> = [
  { key: "plate_number", label: "Plate #" },
  { key: "model", label: "Model" },
  { key: "body_number", label: "Body #" },
  { key: "registration_expiration", label: "Reg. Exp." },
  { key: "maintenance_status", label: "Status" },
];

const MAX_RECORDS = 50;

export default function TricycleBatchUpload() {
  const [state, setState] = useState<UploadState>("idle");
  const [rows, setRows] = useState<RowValidationResult<TricycleCSVRow>[]>([]);
  const [result, setResult] = useState<BatchCreateResult<TricycleCSVRow> | null>(null);
  const [debugInfo, setDebugInfo] = useState<{ headers: string[]; firstRow: Record<string, string> } | null>(null);

  const handleFileSelect = useCallback(async (content: string) => {
    setState("parsing");

    try {
      const { rows: parsedRows, headers, errors } = parseCSV(content);

      // Debug logging
      console.log("Parsed headers:", headers);
      console.log("First row data:", parsedRows[0]);
      setDebugInfo({ headers, firstRow: parsedRows[0] || {} });

      if (errors.length > 0) {
        console.error("CSV parse errors:", errors);
      }

      if (parsedRows.length > MAX_RECORDS) {
        setRows([
          {
            rowIndex: 0,
            isValid: false,
            isDuplicate: false,
            data: null,
            errors: [`Too many records. Maximum is ${MAX_RECORDS}, found ${parsedRows.length}`],
          },
        ]);
        setState("previewing");
        return;
      }

      // Parse and validate each row
      const validatedRows: RowValidationResult<TricycleCSVRow>[] = parsedRows.map(
        (row, index) => {
          const parsed = {
            plate_number: row.plate_number || "",
            model: row.model || "",
            year: row.year || "",
            body_number: row.body_number || "",
            seating_capacity: row.seating_capacity || "",
            fuel_type: row.fuel_type || "",
            mileage: row.mileage || "",
            maintenance_status: (row.maintenance_status || "ok") as "ok" | "due" | "critical",
            registration_number: row.registration_number || "",
            or_number: row.or_number || "",
            cr_number: row.cr_number || "",
            franchise_number: row.franchise_number || "",
            registration_expiration: parseDate(row.registration_expiration),
            franchise_expiration: parseDate(row.franchise_expiration),
            last_maintenance_date: parseDate(row.last_maintenance_date),
          };

          const validationResult = TricycleCSVRowSchema.safeParse(parsed);

          if (validationResult.success) {
            return {
              rowIndex: index + 2,
              isValid: true,
              isDuplicate: false,
              data: validationResult.data,
              errors: [],
            };
          }

          return {
            rowIndex: index + 2,
            isValid: false,
            isDuplicate: false,
            data: parsed as TricycleCSVRow,
            errors: validationResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
          };
        }
      );

      // Check for duplicates
      const plateNumbers = validatedRows
        .filter((r) => r.isValid && r.data)
        .map((r) => r.data!.plate_number);

      if (plateNumbers.length > 0) {
        const existingPlates = await checkExistingTricycles(plateNumbers);

        validatedRows.forEach((row) => {
          if (row.data && existingPlates.includes(row.data.plate_number)) {
            row.isDuplicate = true;
          }
        });
      }

      setRows(validatedRows);
      setState("previewing");
    } catch (error) {
      console.error("Error parsing tricycle CSV:", error);
      setState("idle");
    }
  }, []);

  const handleImport = useCallback(async () => {
    setState("importing");

    const validTricycles = rows
      .filter((r) => r.isValid && !r.isDuplicate && r.data)
      .map((r) => r.data!);

    try {
      const importResult = await batchCreateTricycles(validTricycles);
      importResult.summary.skipped = rows.filter((r) => r.isDuplicate).length;
      setResult(importResult);
      setState("complete");
    } catch (error) {
      console.error("Error importing tricycles:", error);
      setState("previewing");
    }
  }, [rows]);

  const resetState = useCallback(() => {
    setState("idle");
    setRows([]);
    setResult(null);
    setDebugInfo(null);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Tricycles</CardTitle>
        <CardDescription>
          Import multiple tricycles from a CSV file. All tricycles will be
          created with inactive status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state === "idle" && (
          <CSVDropzone
            onFileSelect={handleFileSelect}
            templateUrl="/templates/tricycle_template.csv"
            templateName="tricycle_template.csv"
          />
        )}

        {state === "parsing" && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3">Parsing CSV...</span>
          </div>
        )}

        {state === "previewing" && (
          <>
            {debugInfo && (
              <div className="mb-4 rounded border border-yellow-500 bg-yellow-50 p-4 text-sm dark:bg-yellow-950">
                <p className="font-semibold text-yellow-800 dark:text-yellow-200">Debug Info:</p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  <strong>Parsed headers:</strong> {debugInfo.headers.join(", ")}
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  <strong>First row plate_number:</strong> &quot;{debugInfo.firstRow?.plate_number || "(empty)"}&quot;
                </p>
                <p className="text-yellow-700 dark:text-yellow-300">
                  <strong>First row keys:</strong> {Object.keys(debugInfo.firstRow || {}).join(", ")}
                </p>
              </div>
            )}
            <PreviewTable
              rows={rows}
              columns={TRICYCLE_COLUMNS}
              onConfirm={handleImport}
              onCancel={resetState}
            />
          </>
        )}

        {state === "importing" && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3">Creating tricycles...</span>
          </div>
        )}

        {state === "complete" && result && (
          <ImportSummary
            result={result}
            type="tricycles"
            onReset={resetState}
          />
        )}
      </CardContent>
    </Card>
  );
}
