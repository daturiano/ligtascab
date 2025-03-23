import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignUpForm from "@/features/authentication/components/sign-up-form";

export default function SignUpPage() {
  return (
    <Card className="max-w-[32rem]">
      <CardHeader>
        <CardTitle className="text-2xl">Create operator account</CardTitle>
        <CardDescription className="lg:text-lg">
          Sign up using the form to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className="text-xs text-center lg:text-start lg:text-sm">
          By creating your account, you agree to our Terms of Service , our
          Product T&C&apos;s and that you have read and understood our Privacy
          Policy.
        </p>
      </CardFooter>
    </Card>
  );
}
