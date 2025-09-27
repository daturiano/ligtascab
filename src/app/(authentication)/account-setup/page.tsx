"use client";

import { useCreateOperator } from "@/features/authentication/components/create-operator-provider";
import dynamic from "next/dynamic";

const PersonalDetailsForm = dynamic(
  () => import("@/features/authentication/components/personal-details-form"),
  {
    ssr: false,
  },
);
const OperatorDocumentsUpload = dynamic(
  () =>
    import("@/features/authentication/components/operator-documents-upload"),
  {
    ssr: false,
  },
);
const FormReview = dynamic(
  () => import("@/features/authentication/components/form-review"),
  {
    ssr: false,
  },
);
const AddressForm = dynamic(
  () => import("@/features/authentication/components/address-form"),
  {
    ssr: false,
  },
);

export default function AccountSetupPage() {
  const { step } = useCreateOperator();

  return (
    <>
      {step === 1 && <PersonalDetailsForm />}
      {step === 2 && <AddressForm />}
      {step === 3 && <OperatorDocumentsUpload />}
      {step === 4 && <FormReview />}
    </>
  );
}
