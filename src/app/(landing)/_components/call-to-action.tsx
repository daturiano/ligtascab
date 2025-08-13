import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import android from "@/app/public/android-brand.svg";
import apple from "@/app/public/apple-brand.svg";

export default function CallToAction() {
  return (
    <section className="flex w-full items-center justify-center">
      <div className="bg-primary flex w-full flex-col items-center justify-between gap-12 rounded-md p-14 md:flex-row md:gap-32 lg:max-w-(--breakpoint-xl)">
        <div className="flex flex-col gap-4">
          <h4 className="text-primary-foreground text-lg leading-tight font-semibold md:text-start md:text-2xl lg:text-4xl">
            Whether it’s a quick trip or a long journey, your ride is just a tap
            away.
          </h4>
          <p>
            We created this platform with a simple vision — to provide safer,
            more convenient tricycle rides for commuters while empowering
            drivers and operators with powerful digital tools.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            size="lg"
            className="gap-2 border-0 bg-black px-4 py-6 duration-200 hover:bg-black/70 md:gap-4 md:px-10 md:py-10"
          >
            <Image src={apple} alt="apple logo" className="md:h-10 md:w-10" />
            <div className="flex flex-col items-start text-white">
              <p className="text-xs md:text-lg">Download on</p>
              <p className="text-md font-bold md:text-xl">Apple Store</p>
            </div>
          </Button>
          <Button
            size="lg"
            className="gap-2 border-0 bg-black px-4 py-6 duration-200 hover:bg-black/70 md:gap-4 md:px-14 md:py-10"
          >
            <Image src={android} alt="apple logo" className="md:h-10 md:w-10" />
            <div className="flex flex-col items-start text-white">
              <p className="text-xs md:text-lg">Download on</p>
              <p className="text-md font-bold md:text-xl">Play Store</p>
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}
