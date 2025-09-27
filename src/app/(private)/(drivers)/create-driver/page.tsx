"use client";

import { useCreateDriver } from "@/features/drivers/components/create-driver-provider";
import dynamic from "next/dynamic";

const DriverDetailsForm = dynamic(
  () => import("@/features/drivers/components/driver-details-form"),
  {
    ssr: false,
  },
);

const DriverLicenseForm = dynamic(
  () => import("@/features/drivers/components/driver-license-form"),
  {
    ssr: false,
  },
);

const DriverSignUpForm = dynamic(
  () => import("@/features/drivers/components/driver-sign-up-form"),
  {
    ssr: false,
  },
);

const FormReview = dynamic(
  () => import("@/features/drivers/components/form-review"),
  {
    ssr: false,
  },
);

export default function CreateDriverPage() {
  const { step } = useCreateDriver();

  return (
    <>
      {step == 1 && <DriverDetailsForm />}
      {step == 2 && <DriverLicenseForm />}
      {step == 3 && <FormReview />}
      {step == 4 && <DriverSignUpForm />}
    </>
  );
}
