import TricycleComplianceForm from '@/features/tricycles/components/tricycle-compliance-form';
import TricycleDetailsForm from '@/features/tricycles/components/tricycle-details-form';
import TricycleDocumentsUpload from '@/features/tricycles/components/tricycle-documents-upload';
import TricycleMaintenanceForm from '@/features/tricycles/components/tricycle-maintenance-form';
import { toast } from 'sonner';
import {
  createNewTricycle,
  uploadTricycleDocument,
} from '../actions/tricycles';
import { useCreateTricycle } from './create-tricycle-provider';
import FormBottomNavigation from './form-bottom-navigation';

export default function FormReview() {
  const { formData } = useCreateTricycle();

  const onSubmit = async () => {
    try {
      const {
        success,
        error,
        data: tricycle,
      } = await createNewTricycle(formData);

      if (!success || !tricycle?.id) {
        toast.error(error || 'Unknown error');
        return;
      }

      const uploadResults = await uploadTricycleDocument(
        tricycle.id,
        formData.attachmentDetails!
      );

      console.log('Documents uploaded:', uploadResults);
      toast.success('Tricycle created successfully!');
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
      <FormBottomNavigation onSubmit={() => onSubmit} />
    </div>
  );
}
