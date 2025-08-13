import React from "react";
import { Bell, HandCoins, QrCode } from "lucide-react";
import SectionHeader from "./section-header";
import FeatureCard from "./feature-card";

export default function Features() {
  return (
    <section
      id="features"
      className="z-10 flex flex-col items-center justify-center gap-8 text-center"
    >
      <SectionHeader
        title="Features"
        subtitle="Key features that make your commute effortless"
        description="Experience effortless commuting with secure rides, transparent
                fees, and comfortable transport options. Enjoy connections and
                convenient amenities for a stress-free journey!"
      />
      <div className="flex flex-col gap-6 md:py-8 lg:flex-row lg:gap-4">
        <FeatureCard
          heading="Secure Rides"
          subheading="Feel safe with QR code verification and driver information at your
            fingertips."
        >
          <QrCode color="#1FAB89" className="md:h-7 md:w-7" />
        </FeatureCard>
        <FeatureCard
          heading="Transparent Fees"
          subheading="See fare estimates upfront, ensuring you always know the cost before you ride."
        >
          <HandCoins color="#1FAB89" className="md:h-7 md:w-7" />
        </FeatureCard>
        <FeatureCard
          heading="Emergency Alerts"
          subheading="In case of any emergency, instantly send your location and ride details to authorities."
        >
          <Bell color="#1FAB89" className="md:h-7 md:w-7" />
        </FeatureCard>
      </div>
    </section>
  );
}
