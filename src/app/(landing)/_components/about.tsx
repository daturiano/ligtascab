import React from "react";
import SectionHeader from "./section-header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import phone from "@/app/public/about-img.svg";

export default function About() {
  return (
    <section
      id="about"
      className="flex flex-col items-center justify-center gap-4 px-16 text-center lg:grid lg:grid-cols-2 lg:text-start"
    >
      <div className="space-y-4 lg:space-y-10">
        <SectionHeader
          title="About"
          subtitle="Making tricycle commuting safe and easy"
          description="We created this platform with a simple vision to provide safer, more convenient tricycle rides for commuters while empowering drivers and operators with powerful digital tools."
        />
        <Button className="py-6">Be our partner</Button>
      </div>
      <Image
        src={phone}
        alt="picture of a phone with ligtascab app"
        className="ml-42 lg:mt-16"
      />
    </section>
  );
}
