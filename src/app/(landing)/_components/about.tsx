import React from "react";
import SectionHeader from "./section-header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import phone from "@/app/public/about-img.svg";

export default function About() {
  return (
    <section
      id="about"
      className="relative grid grid-cols-[1fr_auto] flex-col items-center justify-center gap-24 overflow-x-hidden text-balance lg:grid-cols-2 lg:px-16 lg:text-start"
    >
      <div className="space-y-4 lg:space-y-10">
        <SectionHeader
          title="About"
          subtitle="Making tricycle commuting safe and easy"
          description="We created this platform with a simple vision to provide safer, more convenient tricycle rides for commuters while empowering drivers and operators with powerful digital tools."
        />
        <Button className="py-6">Be our partner</Button>
      </div>
      <div>
        <Image
          src={phone}
          alt="picture of a phone with ligtascab app"
          width={240}
          height={240}
          className="absolute top-0 -right-30 z-10 mt-16 -rotate-z-90 lg:hidden"
        />
        <Image
          src={phone}
          alt="picture of a phone with ligtascab app"
          className="z-50 ml-42 hidden lg:mt-16 lg:block"
        />
      </div>
    </section>
  );
}
