import { toast } from 'sonner';
import { createNewDriver, uploadDriverDocument } from '../actions/drivers';
import { useCreateDriver } from './create-driver-provider';
import DriverDetailsForm from './driver-details-form';
import DriverLicenseForm from './driver-license-form';
import FormBottomNavigation from './form-bottom-navigation';

export default function FormReview() {
  const { formData } = useCreateDriver();

  const onSubmit = async () => {
    try {
      const result = await createNewDriver(formData);

      if (!result.success) {
        toast.error(result.error || 'Unknown error');
        return;
      }

      const uploadResults = await uploadDriverDocument(
        formData.complianceDetails!.license_number,
        formData.attachmentDetails!
      );

      console.log('Documents uploaded:', uploadResults);
      toast.success('Driver created successfully!');
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-24">
        <DriverDetailsForm />
        <DriverLicenseForm />
      </div>
      <FormBottomNavigation onSubmit={() => onSubmit} />
    </div>
  );
}
