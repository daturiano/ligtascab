import DocumentCard from '@/features/authentication/components/document-card';
import { DocumentType } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useCreateOperator } from './create-operator-provider';
import FormBottomNavigation from '@/components/form-bottom-navigation';

const MAX_FILE_SIZE_MB = 5;

const document_types: DocumentType[] = [
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

  useEffect(() => {
    if (formData.attachmentDetails) {
      const initialFiles: { [key: string]: File | null } = {};
      Object.keys(formData.attachmentDetails).forEach((docId) => {
        const attachment = formData.attachmentDetails![docId];
        if (attachment?.file) {
          initialFiles[docId] = attachment.file;
        }
      });
      setSelectedFiles(initialFiles);
    }
  }, [formData.attachmentDetails]);

  const handleFileSelect = (docId: string, file: File | null) => {
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      alert(`"${file.name}" exceeds the 5MB file size limit.`);
      return;
    }

    setSelectedFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));

    const docType = document_types.find((doc) => doc.id === docId);
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

  const areRequiredDocumentsUploaded = () => {
    const requiredDocs = document_types.filter((doc) => doc.required);
    return requiredDocs.every(
      (doc) =>
        selectedFiles[doc.id] !== null && selectedFiles[doc.id] !== undefined
    );
  };

  const handleContinue = () => {
    if (!areRequiredDocumentsUploaded()) {
      alert('Please upload all required documents before continuing.');
      return;
    }
    nextStep();
  };

  return (
    <>
      <div className="w-full lg:max-w-[650px]">
        <div className="flex flex-col gap-4 w-full">
          {document_types.map((docType) => (
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
      <FormBottomNavigation
        onSubmit={handleContinue}
        prevStep={prevStep}
        disabled={!areRequiredDocumentsUploaded()}
      />
    </>
  );
}
