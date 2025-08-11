import React from "react";
import SectionHeader from "./section-header";
import { AccordionDemo } from "./accordion";

export default function FAQ() {
  return (
    <section
      id="faqs"
      className="flex flex-col items-center justify-center gap-6 text-center md:mt-40 md:gap-14"
    >
      <SectionHeader
        title="FAQs"
        subtitle="Any Questions? Look Here"
        description="Quick answers to questions you may have."
      />
      <AccordionDemo />
    </section>
  );
}
