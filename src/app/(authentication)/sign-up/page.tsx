"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import GoogleButton from "@/features/authentication/components/google-btn";
import dynamic from "next/dynamic";

const SignUpForm = dynamic(
  () => import("@/features/authentication/components/sign-up-form"),
  {
    ssr: false,
  },
);

export default function SignUpPage() {
  return (
    <Card className="max-w-[32rem] px-4">
      <CardHeader>
        <CardTitle className="text-2xl">Create operator account</CardTitle>
        <CardDescription className="lg:text-lg">
          Sign up using the form, or with Google account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GoogleButton />
        <div className="my-8 flex w-full items-center gap-4">
          <Separator className="shrink-1" />
          <p className="text-muted-foreground">or</p>
          <Separator className="shrink-1" />
        </div>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className="text-center text-xs lg:text-sm">
          By creating your account, you agree to our Terms of Service , our
          Product T&C&apos;s and that you have read and understood our Privacy
          Policy.
        </p>
      </CardFooter>
    </Card>
  );
}
