import { Button } from '@/components/ui/button';
import DocumentCard from '@/features/authentication/components/document-card';
import { DocumentType } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useCreateTricycle } from './create-tricycle-provider';

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
  const { step, prevStep, nextStep, formData, setData, readonly } =
    useCreateTricycle();
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
      <div className="min-w-[650px] max-w-[650px] w-full">
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
      <div
        className={`w-full bg-card h-16 flex items-center absolute bottom-0 left-0 ${
          readonly && 'hidden'
        }`}
      >
        <div className="max-w-screen-lg w-full mx-auto flex justify-between">
          <Button
            variant={'outline'}
            size={'lg'}
            disabled={step === 1}
            onClick={prevStep}
          >
            <ArrowLeft />
            Back
          </Button>
          <Button size={'lg'} onClick={nextStep}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
