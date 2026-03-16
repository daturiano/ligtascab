import {
  getDriverByIdAction,
  suspendUserAction,
  unsuspendUserAction,
} from "@/features/authority/actions/entity-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import DriverActions from "@/features/super-admin/components/driver-actions";

interface DriverDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AuthorityDriverDetailPage({
  params,
}: DriverDetailPageProps) {
  const { id } = await params;
  const { data: driver, error } = await getDriverByIdAction(id);

  if (error || !driver) {
    notFound();
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-6">
        <Link href="/authority/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {driver.first_name} {driver.last_name}
          </h1>
          <p className="text-muted-foreground mt-1">Driver Details</p>
        </div>
        {getStatusBadge(driver.status)}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Full Name
              </p>
              <p className="text-lg">
                {driver.first_name} {driver.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{driver.email || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-lg">{driver.phone_number || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Birth Date
              </p>
              <p className="text-lg">
                {driver.birth_date
                  ? new Date(driver.birth_date).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p className="text-lg">{driver.address || "Not provided"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>License & Employment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Operator
              </p>
              <p className="text-lg">
                {driver.operators
                  ? `${driver.operators.first_name} ${driver.operators.last_name}`
                  : "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                License Number
              </p>
              <p className="text-lg">{driver.license_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                License Expiration
              </p>
              <p className="text-lg">
                {driver.license_expiration
                  ? new Date(driver.license_expiration).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Emergency Contact
              </p>
              <p className="text-lg">
                {driver.emergency_contact_name || "Not provided"}
              </p>
              <p className="text-sm text-muted-foreground">
                {driver.emergency_contact_number || ""}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <DriverActions
              driverId={driver.id}
              userId={driver.user_id}
              currentStatus={driver.status}
              role="authority"
              basePath="/authority"
              suspendAction={suspendUserAction}
              unsuspendAction={unsuspendUserAction}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
