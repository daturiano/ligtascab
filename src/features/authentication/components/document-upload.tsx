'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import DocumentCard from './document-card';
import { useProgress } from './progress-provider';

// Type declarations
interface DocumentType {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: 'tricycle-permit',
    title: 'Tricycle Operator Permit',
    description: 'Upload the official tricycle operator permit document',
    required: true,
  },
  {
    id: 'business-permit',
    title: 'Business Permit',
    description: 'Upload your current business permit from the municipality',
    required: true,
  },
];

export function DocumentUpload() {
  const { updateData, formData, setFormValid } = useProgress();

  // Use selected files directly from context if available, or initialize empty
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});

  const handleFileSelect = (docId: string, file: File | null) => {
    // Update local state
    setSelectedFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));

    // Update context simultaneously
    const docType = DOCUMENT_TYPES.find((doc) => doc.id === docId);

    if (docType) {
      updateData({
        attachmentDetails: {
          ...(formData.attachmentDetails || {}),
          [docId]: {
            file,
            documentId: docId,
            documentTitle: docType.title,
          },
        },
      });
    }
  };

  useEffect(() => {
    const isValid = DOCUMENT_TYPES.filter((docType) => docType.required).every(
      (docType) => selectedFiles[docType.id]
    );
    setFormValid(isValid);
  }, [selectedFiles, setFormValid]);

  return (
    <Card className="w-full max-w-[28rem]">
      <CardHeader>
        <CardTitle className="text-2xl">Required Documents</CardTitle>
        <CardDescription>
          Please attach all the required documents below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {DOCUMENT_TYPES.map((docType) => (
            <DocumentCard
              key={docType.id}
              document={docType}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFiles[docType.id] || null}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
