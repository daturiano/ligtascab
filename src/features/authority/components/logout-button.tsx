"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "@/features/authentication/actions/authentication";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await signOut();
      }}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
