import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Seperator from "@/components/ui/seperator";
import GoogleButton from "@/features/authentication/components/google-btn";
import SignInForm from "@/features/authentication/components/sign-in-form";

export default function SignInPage() {
  return (
    <Card className="w-full max-w-[28rem]">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
      </CardHeader>
      <CardContent>
        <GoogleButton option="sign-in" />
        <div className="my-8 flex items-center gap-6">
          <Seperator />
          <p className="text-muted-foreground">or</p>
          <Seperator />
        </div>
        <SignInForm />
      </CardContent>
      <CardFooter>
        <p className="text-xs text-center lg:text-start lg:text-sm">
          Need to create an account? Sign up
        </p>
      </CardFooter>
    </Card>
  );
}
