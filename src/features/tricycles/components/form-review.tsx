import { Button } from '@/components/ui/button';
import TricycleComplianceForm from '@/features/tricycles/components/tricycle-compliance-form';
import TricycleDetailsForm from '@/features/tricycles/components/tricycle-details-form';
import TricycleDocumentsUpload from '@/features/tricycles/components/tricycle-documents-upload';
import TricycleMaintenanceForm from '@/features/tricycles/components/tricycle-maintenance-form';
import { ArrowLeft } from 'lucide-react';
import {
  submitUserFormData,
  uploadDocumentFormData,
} from '../actions/tricycles';
import { useCreateTricycle } from './create-tricycle-provider';

export default function FormReview() {
  const { prevStep, formData } = useCreateTricycle();

  const onSubmit = async () => {
    try {
      const userResponse = await submitUserFormData(formData);

      if (!userResponse?.success) {
        console.error('User form submission failed');
        return;
      }

      if (!formData.tricycleDetails) return null;

      const uploadResults = await uploadDocumentFormData(
        formData.tricycleDetails.registration_number,
        formData.attachmentDetails
      );

      console.log('Documents uploaded:', uploadResults);
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-24">
        <TricycleDetailsForm />
        <TricycleComplianceForm />
        <TricycleMaintenanceForm />
        <TricycleDocumentsUpload />
      </div>
      <div
        className={`w-full bg-card h-16 flex items-center fixed bottom-0 left-0`}
      >
        <div className="max-w-screen-lg w-full mx-auto flex justify-between">
          <Button variant={'outline'} size={'lg'} onClick={prevStep}>
            <ArrowLeft />
            Back
          </Button>
          <Button size={'lg'} onClick={onSubmit}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
