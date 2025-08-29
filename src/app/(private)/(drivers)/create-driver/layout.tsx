"use client";

import CreateDriverProvider from "@/features/drivers/components/create-driver-provider";
import DriverFormProgress from "@/features/drivers/components/driver-form-progress";
import { useMobile } from "@/hooks/useMobile";
import React, { ReactNode } from "react";

export default function CreateDriverLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isSmallScreen = useMobile({ max: 960 });
  return (
    <CreateDriverProvider>
      <div className="flex flex-1 flex-col justify-between">
        <div className="mx-auto flex max-w-screen-lg flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold lg:text-3xl">
              Create your driver
            </h1>
            <p className="text-muted-foreground text-sm lg:text-lg">
              Create a driver information for operational use
            </p>
          </div>
          <div className="flex items-start gap-8">
            {children}
            {!isSmallScreen && <DriverFormProgress />}
          </div>
        </div>
      </div>
    </CreateDriverProvider>
  );
}
