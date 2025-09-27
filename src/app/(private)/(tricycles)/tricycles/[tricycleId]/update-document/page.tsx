"use client";

import LogoWithName from "@/components/ui/logo-with-name";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { useSearchParams, useParams, useRouter } from "next/navigation";

type FormProps = { tricycleId: string };

const UpdateFranchiseForm = dynamic<FormProps>(
  () => import("@/features/tricycles/components/update-franchise-form"),
  { ssr: false },
);

const UpdateMaintenanceForm = dynamic<FormProps>(
  () => import("@/features/tricycles/components/update-maintenance-form"),
  { ssr: false },
);

const UpdateReceiptForm = dynamic<FormProps>(
  () => import("@/features/tricycles/components/update-receipt-form"),
  { ssr: false },
);

const UpdateRegistrationForm = dynamic<FormProps>(
  () => import("@/features/tricycles/components/update-registration-form"),
  { ssr: false },
);

const formMap: Record<string, React.ComponentType<FormProps>> = {
  "update-registration": UpdateRegistrationForm,
  "update-or": UpdateReceiptForm,
  "update-franchise": UpdateFranchiseForm,
  "update-maintenance": UpdateMaintenanceForm,
};

export default function UpdateDocumentPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const tricycleId = params.id as string;
  const type = searchParams.get("type");

  const FormComponent = type ? formMap[type] : null;

  if (!FormComponent) return <div>Not found</div>;

  return (
    <div className="bg-background absolute inset-0 z-50 flex min-h-screen min-w-screen flex-col space-y-12">
      <div className="bg-white p-6">
        <div className="mx-auto flex max-w-screen-xl flex-row items-center justify-between">
          <LogoWithName />
          <X onClick={() => router.back()} className="cursor-pointer" />
        </div>
      </div>
      <div className="mx-auto flex flex-1 items-start gap-8 px-2">
        <FormComponent tricycleId={tricycleId} />
      </div>
    </div>
  );
}
