"use client";

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "../actions/authentication";
import Image from "next/image";
import logoo from "@/app/public/google.png";

type option = "sign-in" | "sign-up";

export default function GoogleButton({
  option = "sign-up",
}: {
  option?: option;
}) {
  return (
    <Button
      onClick={signInWithGoogle}
      className="w-full h-10"
      variant={"outline"}
    >
      <Image src={logoo} alt="google logo" height={24} width={24} />
      {option === "sign-up" ? "Sign up with Google" : "Log in using Google"}
    </Button>
  );
}
