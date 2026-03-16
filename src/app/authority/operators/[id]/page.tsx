import {
  getOperatorByIdAction,
  suspendUserAction,
  unsuspendUserAction,
} from "@/features/authority/actions/entity-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import OperatorActions from "@/features/super-admin/components/operator-actions";

interface OperatorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AuthorityOperatorDetailPage({
  params,
}: OperatorDetailPageProps) {
  const { id } = await params;
  const { data: operator, error } = await getOperatorByIdAction(id);

  if (error || !operator) {
    notFound();
  }

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "rejected":
        return <Badge variant="outline">Rejected</Badge>;
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
            {operator.first_name} {operator.last_name}
          </h1>
          <p className="text-muted-foreground mt-1">Operator Details</p>
        </div>
        {getStatusBadge(operator.status)}
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
                {operator.first_name} {operator.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{operator.email || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-lg">
                {operator.phone_number || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Birth Date
              </p>
              <p className="text-lg">
                {operator.birth_date
                  ? new Date(operator.birth_date).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Cooperative Name
              </p>
              <p className="text-lg">{operator.coop_name || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p className="text-lg">
                {operator.address?.address || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Municipality
              </p>
              <p className="text-lg">
                {operator.address?.municipality || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Province
              </p>
              <p className="text-lg">
                {operator.address?.province || "Not provided"}
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
            <OperatorActions
              operatorId={operator.id}
              currentStatus={operator.status}
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
