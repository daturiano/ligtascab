"use client";

import { useCreateTricycle } from "@/features/tricycles/components/create-tricycle-provider";
import dynamic from "next/dynamic";

const FormReview = dynamic(
  () => import("@/features/tricycles/components/form-review"),
  {
    ssr: false,
  },
);

const TricycleComplianceForm = dynamic(
  () => import("@/features/tricycles/components/tricycle-compliance-form"),
  {
    ssr: false,
  },
);

const TricycleDetailsForm = dynamic(
  () => import("@/features/tricycles/components/tricycle-details-form"),
  {
    ssr: false,
  },
);

const TricycleDocumentsUpload = dynamic(
  () => import("@/features/tricycles/components/tricycle-documents-upload"),
  {
    ssr: false,
  },
);

const TricycleMaintenanceForm = dynamic(
  () => import("@/features/tricycles/components/tricycle-maintenance-form"),
  {
    ssr: false,
  },
);

export default function CreateTricyclePage() {
  const { step } = useCreateTricycle();

  return (
    <>
      {step == 1 && <TricycleDetailsForm />}
      {step == 2 && <TricycleComplianceForm />}
      {step == 3 && <TricycleMaintenanceForm />}
      {step == 4 && <TricycleDocumentsUpload />}
      {step == 5 && <FormReview />}
    </>
  );
}
