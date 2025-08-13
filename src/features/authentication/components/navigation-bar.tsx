"use client";

import { Button } from "@/components/ui/button";
import LogoWithName from "@/components/ui/logo-with-name";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "../actions/authentication";

export default function NavigationBar() {
  const path = usePathname();
  const router = useRouter();

  return (
    <div className="flex w-full items-center justify-between px-4 pt-4 lg:px-6 lg:pt-6">
      <LogoWithName />
      <div className="flex items-center gap-2">
        {path === "/sign-up" && (
          <div className="flex items-center gap-2">
            <p className="hidden lg:block">Already have an account?</p>
            <Button onClick={() => router.push("/sign-in")} variant={"outline"}>
              Log in
            </Button>
          </div>
        )}
        {path === "/sign-in" && (
          <div className="flex items-center gap-2">
            <p className="hidden lg:block">Don&apos;t have an account?</p>
            <Button onClick={() => router.push("/sign-up")} variant={"outline"}>
              Sign up
            </Button>
          </div>
        )}
        {path === "/account-setup" && (
          <Button onClick={signOut} variant={"outline"}>
            Log out
          </Button>
        )}
      </div>
    </div>
  );
}
