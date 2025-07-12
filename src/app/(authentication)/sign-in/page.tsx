import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GoogleButton from '@/features/authentication/components/google-btn';
import SignInForm from '@/features/authentication/components/sign-in-form';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <Card className="w-full max-w-[28rem] px-4">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
      </CardHeader>
      <CardContent>
        <GoogleButton option="sign-in" />
        <div className="my-8 flex items-center gap-6">
          <Separator className="shrink-1" />
          <p className="text-muted-foreground">or</p>
          <Separator className="shrink-1" />
        </div>
        <SignInForm />
      </CardContent>
      <CardFooter>
        <div className="flex items-center gap-2">
          <p className="text-xs lg:text-sm">Need to create an account?</p>
          <Link href={'/sign-up'}>
            <p className="text-blue-400 text-xs lg:text-sm">Sign up</p>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
