"use client";

import LogoWithName from "@/components/ui/logo-with-name";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React from "react";

const MaintenanceRecordForm = dynamic(
  () => import("@/features/tricycles/components/maintenance-record-form"),
  { ssr: false },
);

export default function CreateRecordPage() {
  const router = useRouter();
  return (
    <div className="bg-background absolute inset-0 z-50 flex min-h-screen flex-col space-y-12 overflow-x-hidden">
      <div className="bg-white py-6">
        <div className="mx-auto flex max-w-screen-xl flex-row items-center justify-between">
          <LogoWithName />
          <X onClick={() => router.back()} className="cursor-pointer" />
        </div>
      </div>
      <MaintenanceRecordForm />
    </div>
  );
}
