'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileIcon, XIcon } from 'lucide-react';
import { ChangeEvent, useRef } from 'react';
import { toast } from 'sonner';

// Define maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Type declarations
interface DocumentType {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

interface DocumentCardProps {
  document: DocumentType;
  onFileSelect: (docId: string, file: File | null) => void;
  selectedFile: File | null;
  readonly: boolean;
}

export default function DocumentCard({
  document,
  onFileSelect,
  selectedFile,
  readonly,
}: DocumentCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
      return;
    }

    onFileSelect(document.id, file);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    onFileSelect(document.id, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="w-full flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <FileIcon className="h-6 w-6" />
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-md font-bold">{document.title}</h3>
              {document.required && (
                <span className="text-red-500 text-xs">Required</span>
              )}
            </div>
            <p className="text-muted-foreground text-xs">
              {document.description}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleAttachClick}
          disabled={readonly}
        >
          {selectedFile ? 'Change' : 'Attach'}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden w-full"
          accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        />

        {selectedFile && (
          <div className="flex items-center rounded-md w-full justify-between">
            <span className="text-sm truncate max-w-xs">
              {selectedFile.name}
            </span>
            <Button
              size="sm"
              className="h-8 w-8 p-0"
              variant={'ghost'}
              onClick={removeFile}
              disabled={readonly}
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
