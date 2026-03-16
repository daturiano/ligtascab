"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CSVDropzone from "./csv-dropzone";
import PreviewTable from "./preview-table";
import ImportSummary from "./import-summary";
import { parseCSV, parseDate, normalizePhoneNumber } from "../utils/csv-parser";
import {
  DriverCSVRowSchema,
  RowValidationResult,
  DriverCSVRow,
  BatchCreateResult,
  DriverWithCredentials,
} from "../schemas/batch-upload";
import {
  checkExistingDrivers,
  batchCreateDrivers,
} from "../actions/batch-upload";

type UploadState = "idle" | "parsing" | "previewing" | "importing" | "complete";

const DRIVER_COLUMNS: Array<{ key: keyof DriverCSVRow; label: string }> = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "phone_number", label: "Phone" },
  { key: "license_number", label: "License #" },
  { key: "license_expiration", label: "License Exp." },
];

const MAX_RECORDS = 50;

export default function DriverBatchUpload() {
  const [state, setState] = useState<UploadState>("idle");
  const [rows, setRows] = useState<RowValidationResult<DriverCSVRow>[]>([]);
  const [result, setResult] = useState<BatchCreateResult<DriverWithCredentials> | null>(null);

  const handleFileSelect = useCallback(async (content: string) => {
    setState("parsing");

    try {
      const { rows: parsedRows, headers, errors } = parseCSV(content);

      // Debug logging
      console.log("Parsed headers:", headers);
      console.log("First row data:", parsedRows[0]);

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
      const validatedRows: RowValidationResult<DriverCSVRow>[] = parsedRows.map(
        (row, index) => {
          const parsed = {
            first_name: row.first_name || "",
            last_name: row.last_name || "",
            birth_date: parseDate(row.birth_date),
            address: row.address || "",
            emergency_contact_name: row.emergency_contact_name || "",
            emergency_contact_number: row.emergency_contact_number || "",
            license_number: row.license_number || "",
            license_expiration: parseDate(row.license_expiration),
            phone_number: normalizePhoneNumber(row.phone_number || ""),
          };

          const validationResult = DriverCSVRowSchema.safeParse(parsed);

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
            data: parsed as DriverCSVRow,
            errors: validationResult.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
          };
        }
      );

      // Check for duplicates
      const licenseNumbers = validatedRows
        .filter((r) => r.isValid && r.data)
        .map((r) => r.data!.license_number);

      if (licenseNumbers.length > 0) {
        const existingLicenses = await checkExistingDrivers(licenseNumbers);

        validatedRows.forEach((row) => {
          if (row.data && existingLicenses.includes(row.data.license_number)) {
            row.isDuplicate = true;
          }
        });
      }

      setRows(validatedRows);
      setState("previewing");
    } catch (error) {
      console.error("Error parsing driver CSV:", error);
      setState("idle");
    }
  }, []);

  const handleImport = useCallback(async () => {
    setState("importing");

    const validDrivers = rows
      .filter((r) => r.isValid && !r.isDuplicate && r.data)
      .map((r) => r.data!);

    try {
      const importResult = await batchCreateDrivers(validDrivers);
      importResult.summary.skipped = rows.filter((r) => r.isDuplicate).length;
      setResult(importResult);
      setState("complete");
    } catch (error) {
      console.error("Error importing drivers:", error);
      setState("previewing");
    }
  }, [rows]);

  const resetState = useCallback(() => {
    setState("idle");
    setRows([]);
    setResult(null);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Drivers</CardTitle>
        <CardDescription>
          Import multiple drivers from a CSV file. Each driver will get a
          temporary password for their first login.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state === "idle" && (
          <CSVDropzone
            onFileSelect={handleFileSelect}
            templateUrl="/templates/driver_template.csv"
            templateName="driver_template.csv"
          />
        )}

        {state === "parsing" && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3">Parsing CSV...</span>
          </div>
        )}

        {state === "previewing" && (
          <PreviewTable
            rows={rows}
            columns={DRIVER_COLUMNS}
            onConfirm={handleImport}
            onCancel={resetState}
          />
        )}

        {state === "importing" && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-3">Creating driver accounts...</span>
          </div>
        )}

        {state === "complete" && result && (
          <ImportSummary
            result={result}
            type="drivers"
            onReset={resetState}
          />
        )}
      </CardContent>
    </Card>
  );
}
