import DocumentCard from '@/features/authentication/components/document-card';
import { DocumentType } from '@/lib/types';
import { useState } from 'react';
import { useCreateOperator } from './create-operator-provider';
import FormBottomNavigation from '@/components/form-bottom-navigation';

const MAX_FILE_SIZE_MB = 5;

const document_type: DocumentType[] = [
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

export default function OperatorDocumentsUpload() {
  const { nextStep, formData, setData, prevStep, readonly } =
    useCreateOperator();
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});

  const handleFileSelect = (docId: string, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`"${file.name}" exceeds the 5MB file size limit.`);
      return;
    }

    // Update local state
    setSelectedFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));

    // Update context simultaneously
    const docType = document_type.find((doc) => doc.id === docId);
    if (formData.type === 'account-setup' && docType) {
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
    <div>
      <div className="min-w-[350px] lg:min-w-[650px] lg:max-w-[650px] mb-24 lg:mb-0 w-full">
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
      <FormBottomNavigation onSubmit={nextStep} prevStep={prevStep} />
    </div>
  );
}
