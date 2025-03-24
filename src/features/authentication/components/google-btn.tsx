"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "../actions/authentication";
import Image from "next/image";
import logoo from "@/app/public/google.png";

export default function GoogleButton() {
  return (
    <Button
      onClick={signInWithGoogle}
      className="w-full h-10"
      variant={"outline"}
    >
      <Image src={logoo} alt="google logo" height={24} width={24} />
      Sign up with Google
    </Button>
  );
}
