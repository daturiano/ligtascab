'use client';

import DocumentCard from '@/features/authentication/components/document-card';
import { TricycleFormData } from '@/features/tricycles/components/create-tricycle-provider';
import { DocumentType } from '@/lib/types';
import { useState } from 'react';

type DocumentUploadProps = {
  document_type: DocumentType[];
  formData: TricycleFormData;
  setData: (newData: Partial<TricycleFormData>) => void;
};

export function DocumentUpload({
  document_type,
  formData,
  setData,
}: DocumentUploadProps) {
  // Use selected files directly from context if available, or initialize empty
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  // const [isFormValid, setFormValid] = useState(false);

  const handleFileSelect = (docId: string, file: File | null) => {
    // Update local state
    setSelectedFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));

    // Update context simultaneously
    const docType = document_type.find((doc) => doc.id === docId);

    if (formData.type === 'tricycle' && docType) {
      setData({
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

  // useEffect(() => {
  //   const isValid = document_type
  //     .filter((docType: DocumentType) => docType.required)
  //     .every((docType) => selectedFiles[docType.id]);
  //   setFormValid(isValid);
  // }, [selectedFiles, setFormValid, document_type]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {document_type.map((docType) => (
        <DocumentCard
          key={docType.id}
          document={docType}
          onFileSelect={handleFileSelect}
          selectedFile={selectedFiles[docType.id] || null}
        />
      ))}
    </div>
  );
}
