import {
  getTricycleByIdAction,
  updateTricycleStatusAction,
} from "@/features/authority/actions/entity-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import TricycleActions from "@/features/super-admin/components/tricycle-actions";

interface TricycleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AuthorityTricycleDetailPage({
  params,
}: TricycleDetailPageProps) {
  const { id } = await params;
  const { data: tricycle, error } = await getTricycleByIdAction(id);

  if (error || !tricycle) {
    notFound();
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
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
            {tricycle.plate_number}
          </h1>
          <p className="text-muted-foreground mt-1">Tricycle Details</p>
        </div>
        {getStatusBadge(tricycle.status)}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Plate Number
              </p>
              <p className="text-lg">{tricycle.plate_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Model</p>
              <p className="text-lg">
                {tricycle.tricycle_details?.model || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Year</p>
              <p className="text-lg">
                {tricycle.tricycle_details?.year || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Body Number
              </p>
              <p className="text-lg">
                {tricycle.tricycle_details?.body_number || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Seating Capacity
              </p>
              <p className="text-lg">
                {tricycle.tricycle_details?.seating_capacity || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Fuel Type
              </p>
              <p className="text-lg">
                {tricycle.tricycle_details?.fuel_type || "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance & Registration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Operator
              </p>
              <p className="text-lg">
                {tricycle.operators
                  ? `${tricycle.operators.first_name} ${tricycle.operators.last_name}`
                  : "Unknown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Registration Number
              </p>
              <p className="text-lg">
                {tricycle.compliance_details?.registration_number ||
                  "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Registration Expiration
              </p>
              <p className="text-lg">
                {tricycle.registration_expiration
                  ? new Date(
                      tricycle.registration_expiration
                    ).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Franchise Number
              </p>
              <p className="text-lg">
                {tricycle.compliance_details?.franchise_number ||
                  "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Franchise Expiration
              </p>
              <p className="text-lg">
                {tricycle.franchise_expiration
                  ? new Date(tricycle.franchise_expiration).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Maintenance Status
              </p>
              <p className="text-lg">
                {tricycle.tricycle_details?.maintenance_status || "Not provided"}
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
            <TricycleActions
              tricycleId={tricycle.id}
              currentStatus={tricycle.status}
              role="authority"
              basePath="/authority"
              updateStatusAction={updateTricycleStatusAction}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
