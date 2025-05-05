import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { createNewDriver, uploadDriverDocument } from '../actions/drivers';
import { useCreateDriver } from './create-driver-provider';
import DriverDetailsForm from './driver-details-form';
import DriverLicenseForm from './driver-license-form';

export default function FormReview() {
  const { prevStep, formData } = useCreateDriver();

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
