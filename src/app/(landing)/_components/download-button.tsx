import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import android from "@/app/public/android-brand.svg";
import apple from "@/app/public/apple-brand.svg";

export default function DownloadButton() {
  return (
    <div className="mt-4 flex flex-col gap-4 min-[400px]:flex-row md:mt-8">
      <Button
        size="sm"
        className="gap-4 px-4 py-7 md:px-8 md:py-10"
        variant={"default"}
      >
        <Image src={apple} alt="apple logo" className="md:h-10 md:w-10" />
        <div className="flex flex-col items-start -space-y-1">
          <p className="text-xs md:text-lg">Download on</p>
          <p className="text-md font-bold md:text-xl">Apple Store</p>
        </div>
      </Button>
      <Button
        size="sm"
        className="gap-4 px-4 py-7 md:px-8 md:py-10"
        variant={"default"}
      >
        <Image src={android} alt="apple logo" className="md:h-10 md:w-10" />
        <div className="flex flex-col items-start -space-y-1">
          <p className="text-xs md:text-lg">Download on</p>
          <p className="text-md font-bold md:text-xl">Play Store</p>
        </div>
      </Button>
    </div>
  );
}
