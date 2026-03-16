import SuperAdminLoginForm from "@/features/super-admin/components/super-admin-login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuperAdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-[28rem] px-4">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Super Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SuperAdminLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
