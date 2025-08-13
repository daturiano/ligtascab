"use client";

import { Button } from "@/components/ui/button";
import LogoWithName from "@/components/ui/logo-with-name";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      setIsScrolled(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionName: string) => {
    const sectionId = sectionName.toLowerCase().replace(/\s+/g, "-");
    const element = document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div
      className={`fixed z-50 mx-auto w-full border-b px-4 transition-all duration-300 md:px-8 lg:border-none ${
        isScrolled
          ? "border-muted-foreground/15 bg-white/95 shadow-sm backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="flex h-14 items-center justify-between md:h-16">
        <div className="flex-row gap-12 md:flex">
          <div className="max-w-fit items-center transition-all md:block">
            <LogoWithName />
          </div>
          <div className="hidden items-center justify-center gap-4 md:flex">
            {navData.map((item) => (
              <Button
                key={item}
                variant={"ghost"}
                className="font-normal"
                onClick={() => scrollToSection(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2 lg:space-x-3">
          <Link href={"/sign-in"}>
            <Button variant={"outline"} className="bg-muted-foreground/10">
              Sign in
            </Button>
          </Link>
          <Link href={"/sign-in"}>
            <Button>Be Our Partner</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

const navData = ["Home", "Features", "About", "FAQs"];
