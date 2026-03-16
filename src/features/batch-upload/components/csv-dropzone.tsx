"use client";

import { useCallback, useState } from "react";
import { Upload, FileText, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CSVDropzoneProps {
  onFileSelect: (content: string) => void;
  templateUrl: string;
  templateName: string;
  disabled?: boolean;
}

export default function CSVDropzone({
  onFileSelect,
  templateUrl,
  templateName,
  disabled = false,
}: CSVDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // Validate file type
      if (!file.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setError("File size must be less than 1MB");
        return;
      }

      try {
        const content = await file.text();
        setSelectedFile(file);
        onFileSelect(content);
      } catch {
        setError("Failed to read file");
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile, disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  return (
    <div className="space-y-4">
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          isDragging && !disabled && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive"
        )}
      >
        <CardContent className="p-0">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            {selectedFile ? (
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFile}
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="mb-4 h-10 w-10 text-muted-foreground" />
                <p className="mb-2 text-lg font-medium">
                  Drop your CSV file here
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  or click to browse
                </p>
                <label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleInputChange}
                    disabled={disabled}
                    className="hidden"
                  />
                  <Button variant="outline" disabled={disabled} asChild>
                    <span>Select File</span>
                  </Button>
                </label>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Max 50 records per upload</span>
        <a
          href={templateUrl}
          download={templateName}
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <Download className="h-4 w-4" />
          Download Template
        </a>
      </div>
    </div>
  );
}
