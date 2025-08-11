import React, { ReactNode } from "react";

interface FeatureCardProps {
  children: ReactNode;
  heading: string;
  subheading: string;
}

export default function FeatureCard({
  children,
  heading,
  subheading,
}: FeatureCardProps) {
  return (
    <div className="border-primary text-primary-foreground flex w-56 flex-col items-center justify-center gap-2 rounded-md border p-6 shadow-xs hover:shadow-lg md:h-52 md:w-80 md:items-start md:px-8 md:py-6">
      <div className="flex items-center justify-between gap-2 md:justify-start md:gap-4">
        {children}
        <p className="text-primary text-sm font-bold md:text-xl">{heading}</p>
      </div>
      <p className="text-xs text-pretty text-black/80 md:text-left md:text-lg">
        {subheading}
      </p>
    </div>
  );
}
