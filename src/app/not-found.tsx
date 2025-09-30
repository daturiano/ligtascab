import LogoWithName from "@/components/ui/logo-with-name";
import notFound from "@/app/public/not-found.svg";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen min-w-screen flex-col">
      <div className="flex w-full justify-between px-6 pt-6">
        <LogoWithName />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-12">
        <Image src={notFound} alt="not found image" width={340} height={340} />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-primary font-sans text-4xl font-bold tracking-tight md:text-8xl">
            Whoops!
          </h1>
          <p className="text-muted-foreground">
            It seems the page doesn&apos;t exist.
          </p>
          <Link href={"/"}>
            <Button className="rounded-md">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
