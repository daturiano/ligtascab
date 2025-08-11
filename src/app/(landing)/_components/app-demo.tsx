import Image from "next/image";
import React from "react";
import dashboard from "@/app/public/app-demo.svg";

export default function AppDemo() {
  return (
    <section className="relative mr-8 flex translate-y-12 justify-center">
      <Image src={dashboard} alt="dashboard sample" />
    </section>
  );
}
