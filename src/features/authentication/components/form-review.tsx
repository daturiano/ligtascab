import FormBottomNavigation from '@/components/form-bottom-navigation';
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
    mutationFn: async (data: typeof formData) => {
      const { success, error, data: operator } = await createNewOperator(data);

      if (!success || !operator?.id || error) {
        throw new Error('Failed to create operator account');
      }

      const { success: uploadSuccess, error: UploadError } =
        await uploadOperatorDocument(operator.id, data.attachmentDetails!);

      if (!uploadSuccess || UploadError) {
        throw new Error('Failed to upload documents');
      }

      return { operator };
    },
    onSuccess: (data) => {
      console.log('Operator created:', data.operator);
      toast.success('Operator account created successfully!');
      router.push('/home');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create operator account');
    },
  });

  const onSubmit = async () => {
    if (!formData) {
      toast.error('Form data is missing');
      return;
    }
    createOperatorMutation.mutate(formData);
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
