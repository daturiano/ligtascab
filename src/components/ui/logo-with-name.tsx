import Image from "next/image";
import logo from "@/app/public/logo.svg";
import Link from "next/link";

export default function LogoWithName() {
  return (
    <Link
      href={"/"}
      className="flex items-center gap-3 text-[1.68rem] font-extrabold tracking-tighter"
    >
      <Image src={logo} alt="brandlogo ligtascab" height={26} width={26} />
      <p className="font-nunito text-primary hidden lg:block">ligtascab.</p>
      <div className="border-muted-foreground/20 h-8 border-r-1"></div>
    </Link>
  );
}
