"use client";

import { CheckCircle2, XCircle, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BatchCreateResult, DriverWithCredentials } from "../schemas/batch-upload";
import {
  generateCredentialsCSV,
  downloadCSV,
  getDateString,
} from "../utils/csv-generator";
import Link from "next/link";

interface ImportSummaryProps {
  result: BatchCreateResult<DriverWithCredentials> | BatchCreateResult<unknown>;
  type: "drivers" | "tricycles";
  onReset: () => void;
}

export default function ImportSummary({
  result,
  type,
  onReset,
}: ImportSummaryProps) {
  const handleDownloadCredentials = () => {
    if (type !== "drivers") return;

    const credentials = (result as BatchCreateResult<DriverWithCredentials>).successful;
    const csv = generateCredentialsCSV(credentials);
    const filename = `driver-credentials-${getDateString()}.csv`;
    downloadCSV(csv, filename);
  };

  const isDriverResult = type === "drivers";
  const viewPath = isDriverResult ? "/drivers" : "/tricycles";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {result.summary.created > 0 ? (
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          ) : (
            <XCircle className="h-6 w-6 text-destructive" />
          )}
          Import Complete
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-lg border p-4">
            <p className="text-2xl font-bold text-green-600">
              {result.summary.created}
            </p>
            <p className="text-sm text-muted-foreground">Created</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-2xl font-bold text-destructive">
              {result.summary.failed}
            </p>
            <p className="text-sm text-muted-foreground">Failed</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-2xl font-bold text-yellow-600">
              {result.summary.skipped}
            </p>
            <p className="text-sm text-muted-foreground">Skipped</p>
          </div>
        </div>

        {isDriverResult && result.summary.created > 0 && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="mb-3 font-medium">
              Download credentials for the newly created drivers
            </p>
            <p className="mb-3 text-sm text-muted-foreground">
              This file contains temporary passwords. Share it securely with your
              drivers so they can log in.
            </p>
            <Button onClick={handleDownloadCredentials} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Credentials CSV
            </Button>
          </div>
        )}

        {result.failed.length > 0 && (
          <Accordion type="single" collapsible>
            <AccordionItem value="failures" className="border-none">
              <AccordionTrigger className="py-2 text-sm text-destructive">
                View failed imports ({result.failed.length})
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm">
                  {result.failed.map((fail, index) => (
                    <li key={index} className="text-destructive">
                      {isDriverResult
                        ? `${(fail.data as DriverWithCredentials).first_name} ${(fail.data as DriverWithCredentials).last_name}: ${fail.error}`
                        : `${(fail.data as { plate_number?: string }).plate_number || "Unknown"}: ${fail.error}`}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" onClick={onReset}>
          Upload More
        </Button>
        <Link href={viewPath}>
          <Button>
            View {type === "drivers" ? "Drivers" : "Tricycles"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
