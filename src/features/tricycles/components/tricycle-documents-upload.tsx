import DocumentCard from '@/features/authentication/components/document-card';
import { DocumentType } from '@/lib/types';
import { useState } from 'react';
import { useCreateTricycle } from './create-tricycle-provider';
import FormBottomNavigation from './form-bottom-navigation';

const MAX_FILE_SIZE_MB = 5;

const document_type: DocumentType[] = [
  {
    id: 'certificate-of-registration',
    title: 'Certificate of Registration (CR)',
    description: 'Upload the tricycles Certificate of Registration (CR)',
    required: true,
  },
  {
    id: 'official-receipt',
    title: 'Official Receipt (OR)',
    description: 'Upload the tricycles Official Receipt (OR)',
    required: true,
  },
  {
    id: 'inspection-certificate',
    title: 'Vehicle Inspection Certificate',
    description: 'Upload the tricycles Vehicle Inspection Certificate',
    required: true,
  },
];

export default function TricycleDocumentsUpload() {
  const { nextStep, formData, setData, readonly } = useCreateTricycle();
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
      <FormBottomNavigation onSubmit={nextStep} />
    </div>
  );
}
