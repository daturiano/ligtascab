'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PersonalDetailsForm from '@/features/authentication/components/personal-details-form';
import ProgressBar from '@/features/authentication/components/progress-bar';
import { useProgress } from '@/features/authentication/components/progress-provider';

export default function AccountSetupPage() {
  const { step } = useProgress();

  return (
    <div className="w-full h-[90dvh] flex flex-col">
      <div className="flex flex-grow items-center justify-evenly px-4">
        <Card className="w-full max-w-[28rem]">
          <CardHeader>
            <CardTitle className="text-2xl">Personal Details</CardTitle>
            <CardDescription>
              Please provide your personal details, they will be used to
              complete your profile on ligtascab.
            </CardDescription>
          </CardHeader>
          <CardContent>{step === 1 && <PersonalDetailsForm />}</CardContent>
        </Card>
      </div>
      <ProgressBar />
    </div>
  );
}
