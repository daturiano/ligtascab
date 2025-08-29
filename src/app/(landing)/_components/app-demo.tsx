import Image from "next/image";
import React from "react";
import dashboard from "@/app/public/app-demo.svg";

export default function AppDemo() {
  return (
    <section className="relative mr-8 hidden -translate-y-21 justify-center md:flex">
      <Image src={dashboard} alt="dashboard sample" />
    </section>
  );
}
