import { DocumentUpload } from '@/components/document-upload';
import { Button } from '@/components/ui/button';
import { DocumentType } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { useCreateTricycle } from './create-tricycle-provider';

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
  const { step, prevStep, nextStep, formData, setData } = useCreateTricycle();

  return (
    <div>
      <div className="min-w-[650px] max-w-[650px] w-full">
        <DocumentUpload
          formData={formData}
          document_type={document_type}
          setData={setData}
        />
      </div>
      <div className="w-full bg-card h-16 flex items-center absolute bottom-0 left-0">
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
