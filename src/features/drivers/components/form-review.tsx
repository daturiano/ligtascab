import { getErrorMessage } from '@/lib/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createNewDriver, uploadDriverDocument } from '../actions/drivers';
import { DriverFormData, useCreateDriver } from './create-driver-provider';
import DriverDetailsForm from './driver-details-form';
import DriverLicenseForm from './driver-license-form';
import FormBottomNavigation from './form-bottom-navigation';

export default function FormReview() {
  const { formData, nextStep, setDriver } = useCreateDriver();
  const queryClient = useQueryClient();

  const createDriverMutation = useMutation({
    mutationFn: async (data: DriverFormData) => createNewDriver(data),
  });

  const onSubmit = async () => {
    try {
      const { data: driver } = await createDriverMutation.mutateAsync(formData);
      await uploadDriverDocument(driver.id, formData.attachmentDetails!);
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      setDriver(driver);
      nextStep();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-24">
        <DriverDetailsForm />
        <DriverLicenseForm />
      </div>
      <FormBottomNavigation onSubmit={onSubmit} />
    </div>
  );
}
