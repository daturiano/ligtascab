import LogoWithName from "@/components/ui/logo-with-name";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="mt-16 flex min-w-max flex-col items-center gap-4 border-t py-4"
    >
      <div className="md:text-md flex items-center gap-4 text-xs">
        <LogoWithName />
        <Link href="/">Home</Link>
        <Link href="/">Features</Link>
        <Link href="/">About</Link>
        <Link href="/">FAQs</Link>
      </div>
      <div>
        <p className="text-xs text-[#868686]">
          Copyright © 2025 - All right reserved by Ligtascab
        </p>
      </div>
    </footer>
  );
}
