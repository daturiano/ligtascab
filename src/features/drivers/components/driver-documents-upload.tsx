import DocumentCard from '@/features/authentication/components/document-card';
import { DocumentType } from '@/lib/types';
import { useState } from 'react';
import { useCreateDriver } from './create-driver-provider';

const MAX_FILE_SIZE_MB = 5;

const document_type: DocumentType[] = [
  {
    id: 'license-front',
    title: "Driver's License Front",
    description: "Upload the front part of driver's license",
    required: true,
  },
  {
    id: 'license-back',
    title: "Driver's License Back",
    description: "Upload the back part of driver's license",
    required: true,
  },
];

export default function DriverDocumentsUpload() {
  const { formData, setData, readonly } = useCreateDriver();
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});

  const handleFileSelect = (docId: string, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`"${file.name}" exceeds the 5MB file size limit.`);
      return; // Reject file immediately
    }
    // Update local state
    setSelectedFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));

    // Update context simultaneously
    const docType = document_type.find((doc) => doc.id === docId);

    if (formData.type === 'Driver' && docType) {
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

  return (
    <div className="min-w-[650px] max-w-[650px] w-full px-6">
      <div className="flex flex-col gap-4 w-full">
        {document_type.map((docType) => (
          <DocumentCard
            readonly={readonly}
            key={docType.id}
            document={docType}
            onFileSelect={handleFileSelect}
            selectedFile={selectedFiles[docType.id] || null}
          />
        ))}
      </div>
    </div>
  );
}
