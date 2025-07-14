import FormBottomNavigation from '@/components/form-bottom-navigation';
import { getErrorMessage } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  createNewOperator,
  uploadOperatorDocument,
} from '../actions/authentication';
import AddressForm from './address-form';
import { useCreateOperator } from './create-operator-provider';
import OperatorDocumentsUpload from './operator-documents-upload';
import PersonalDetailsForm from './personal-details-form';

export default function FormReview() {
  const { formData, prevStep } = useCreateOperator();
  const router = useRouter();

  const createOperatorMutation = useMutation({
    mutationFn: async (data: typeof formData) => createNewOperator(data),
  });

  const onSubmit = async () => {
    try {
      const { data: operator } = await createOperatorMutation.mutateAsync(
        formData
      );
      await uploadOperatorDocument(formData.attachmentDetails!);
      toast.success(`Welcome ${operator.first_name} ${operator.last_name}!`);
      router.push('/home');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 mb-24">
        <PersonalDetailsForm />
        <AddressForm />
        <OperatorDocumentsUpload />
      </div>
      <FormBottomNavigation onSubmit={onSubmit} prevStep={prevStep} />
    </div>
  );
}
