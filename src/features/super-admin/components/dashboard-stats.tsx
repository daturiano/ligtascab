import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SuperAdminStats } from "@/lib/types";
import { Users, Bike, FileText, UserX } from "lucide-react";

interface DashboardStatsProps {
  stats: SuperAdminStats;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Operators</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOperators}</div>
          <p className="text-xs text-muted-foreground">
            {stats.suspendedOperators > 0
              ? `${stats.suspendedOperators} suspended`
              : "All active"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDrivers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.suspendedDrivers > 0
              ? `${stats.suspendedDrivers} suspended`
              : "All active"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Tricycles</CardTitle>
          <Bike className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTricycles}</div>
          <p className="text-xs text-muted-foreground">Registered vehicles</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Audit Logs</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLogs}</div>
          <p className="text-xs text-muted-foreground">Total system events</p>
        </CardContent>
      </Card>
    </div>
  );
}
