import TricycleComplianceForm from "@/features/tricycles/components/tricycle-compliance-form";
import TricycleDetailsForm from "@/features/tricycles/components/tricycle-details-form";
import TricycleDocumentsUpload from "@/features/tricycles/components/tricycle-documents-upload";
import TricycleMaintenanceForm from "@/features/tricycles/components/tricycle-maintenance-form";
import { toast } from "sonner";
import {
  createNewTricycle,
  uploadTricycleDocument,
} from "../actions/tricycles";
import {
  TricycleFormData,
  useCreateTricycle,
} from "./create-tricycle-provider";
import FormBottomNavigation from "./form-bottom-navigation";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/utils";

export default function FormReview() {
  const { formData } = useCreateTricycle();
  const router = useRouter();
  const queryClient = useQueryClient();

  const createTricycleMutation = useMutation({
    mutationFn: async (data: TricycleFormData) => createNewTricycle(data),
  });

  const onSubmit = async () => {
    try {
      const { data: tricycle } =
        await createTricycleMutation.mutateAsync(formData);
      await uploadTricycleDocument(tricycle.id, formData.attachmentDetails!);
      queryClient.invalidateQueries({ queryKey: ["tricycles"] });
      toast.success(`Tricycle ${tricycle.plate_number} created successfully!`);
      router.push("/tricycles");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <div className="mb-24 flex flex-col gap-4">
        <TricycleDetailsForm />
        <TricycleComplianceForm />
        <TricycleMaintenanceForm />
        <TricycleDocumentsUpload />
      </div>
      <FormBottomNavigation onSubmit={onSubmit} />
    </div>
  );
}
