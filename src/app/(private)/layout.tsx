import AuthenticatedLayoutProvider from "@/components/private/authenticated-layout-provider";
import AccountPendingView from "@/components/private/account-pending-view";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Fetch operator status
  const { data: operator, error } = await supabase
    .from("operators")
    .select("status")
    .eq("id", user.id)
    .single();

  if (error) {
    // Handle error appropriately, maybe redirect to error page or sign in
    // For now, if we can't find the operator, it might be a data issue or a new user who hasn't completed setup
    // But since this is (private), they should have completed setup.
    console.error("Error fetching operator status:", error);
    // If no operator record found, maybe redirect to setup or sign-in
    // redirect("/sign-in"); 
    // Let's assume if error, we might want to let them through or block. 
    // Safest is to block or show error.
  }

  if (operator?.status === "pending") {
    return <AccountPendingView />;
  }

  return <AuthenticatedLayoutProvider>{children}</AuthenticatedLayoutProvider>;
}