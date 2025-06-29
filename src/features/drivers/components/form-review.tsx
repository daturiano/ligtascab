import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createNewDriver, uploadDriverDocument } from '../actions/drivers';
import { DriverFormData, useCreateDriver } from './create-driver-provider';
import DriverDetailsForm from './driver-details-form';
import DriverLicenseForm from './driver-license-form';
import FormBottomNavigation from './form-bottom-navigation';

export default function FormReview() {
  const { formData } = useCreateDriver();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createDriverMutation = useMutation({
    mutationFn: async (data: DriverFormData) => createNewDriver(data),
  });

  const onSubmit = async () => {
    try {
      await createDriverMutation.mutateAsync(formData);
      await uploadDriverDocument(
        formData.complianceDetails!.license_number,
        formData.attachmentDetails!
      );
      queryClient.invalidateQueries({ queryKey: ['drivers'] });
      toast.success('Driver created successfully!');
      router.push('/drivers');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unexpected error');
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
