'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadImage } from '../actions/authentication';
import DocumentCard from './document-card';

// Type declarations
interface DocumentType {
  id: string;
  title: string;
  description: string;
  required: boolean;
}

interface MultiDocumentUploadProps {
  bucketName: string;
}

interface UploadedDocument {
  documentId: string;
  documentTitle: string;
  url: string;
  filename: string | undefined;
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

export function DocumentUpload({ bucketName }: MultiDocumentUploadProps) {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileSelect = (docId: string, file: File | null) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));
  };

  const areAllRequiredFilesAttached = (): boolean => {
    return DOCUMENT_TYPES.filter((docType) => docType.required).every(
      (docType) => selectedFiles[docType.id]
    );
  };

  const handleCompleteSetup = async () => {
    if (!areAllRequiredFilesAttached()) {
      toast.error('Please attach all required documents');
      return;
    }

    setUploading(true);
    const successfulUploads: UploadedDocument[] = [];

    try {
      // Get documents to upload
      const documentsToUpload = DOCUMENT_TYPES.filter(
        (docType) => selectedFiles[docType.id]
      ).map((docType) => ({
        docType,
        file: selectedFiles[docType.id]!,
      }));

      // Process uploads sequentially to avoid overwhelming the server
      for (const { docType, file } of documentsToUpload) {
        try {
          const result = await uploadImage({
            file,
            bucket: bucketName,
            documentId: docType.id,
          });

          if (result.error) {
            toast.error(`Failed to upload ${docType.title}: ${result.error}`);
          } else {
            successfulUploads.push({
              documentId: docType.id,
              documentTitle: docType.title,
              url: result.imageUrl,
              filename: result.filename,
            });
          }
        } catch (error) {
          console.error(`Error uploading ${docType.title}:`, error);
          toast.error(`Failed to upload ${docType.title}`);
        }
      }

      // Check if all required documents were uploaded
      const allRequiredUploaded = DOCUMENT_TYPES.filter(
        (docType) => docType.required
      ).every((docType) =>
        successfulUploads.some((upload) => upload.documentId === docType.id)
      );

      if (allRequiredUploaded) {
        try {
          // Update user status
          const data = await updateUserNew({ is_new_user: false });
          if (data) {
            toast.success('Setup completed successfully!');
            router.push('/dashboard');
          } else {
            toast.error('Failed to update user status');
          }
        } catch (error) {
          console.error('Error updating user status:', error);
          toast.error('Failed to complete setup');
        }
      } else {
        toast.warning('Some required documents are missing');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to complete document uploads');
    } finally {
      setUploading(false);
    }
  };

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

        {/* <div className="mt-6 w-full">
          <Button
            className="w-full"
            onClick={handleCompleteSetup}
            disabled={!areAllRequiredFilesAttached() || uploading}
          >
            {uploading ? <div>Loading</div> : 'Complete Setup'}
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {!areAllRequiredFilesAttached()
              ? 'Please attach all required documents to continue'
              : 'Click to upload all documents and complete the setup'}
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
}
