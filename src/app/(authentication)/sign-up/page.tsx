import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Seperator from '@/components/ui/seperator';
import GoogleButton from '@/features/authentication/components/google-btn';
import SignUpForm from '@/features/authentication/components/sign-up-form';

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
        <div className="my-8 flex items-center gap-6">
          <Seperator />
          <p className="text-muted-foreground">or</p>
          <Seperator />
        </div>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className="text-xs text-center lg:text-sm">
          By creating your account, you agree to our Terms of Service , our
          Product T&C&apos;s and that you have read and understood our Privacy
          Policy.
        </p>
      </CardFooter>
    </Card>
  );
}
