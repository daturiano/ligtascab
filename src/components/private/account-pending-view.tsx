"use client";

import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { signOut } from "@/features/authentication/actions/authentication";

export default function AccountPendingView() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-gray-50 p-4 text-center">
      <div className="rounded-full bg-yellow-100 p-4">
        <Clock className="h-10 w-10 text-yellow-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">Account Under Review</h1>
      <p className="max-w-md text-muted-foreground">
        Your account registration has been submitted and is currently pending approval by the authority. You will not be able to access the dashboard until your account is approved.
      </p>
      <div className="pt-4">
        <Button onClick={() => signOut()} variant="outline">
          Sign Out
        </Button>
      </div>
    </div>
  );
}
