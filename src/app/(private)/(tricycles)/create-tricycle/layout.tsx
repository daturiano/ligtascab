"use client";

import CreateTricycleProvider from "@/features/tricycles/components/create-tricycle-provider";
import TricycleFormProgress from "@/features/tricycles/components/tricycle-form-progress";
import { useMobile } from "@/hooks/useMobile";
import { ReactNode } from "react";

export default function CreateTricycleLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isSmallScreen = useMobile({ max: 960 });
  return (
    <CreateTricycleProvider>
      <div className="flex flex-1 flex-col justify-between">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold lg:text-3xl">
              Create your tricycle
            </h1>
            <p className="text-muted-foreground text-sm lg:text-lg">
              Create a tricycle information for operational use
            </p>
          </div>
          <div className="flex items-start gap-8">
            {children}
            {!isSmallScreen && <TricycleFormProgress />}
          </div>
        </div>
      </div>
    </CreateTricycleProvider>
  );
}
