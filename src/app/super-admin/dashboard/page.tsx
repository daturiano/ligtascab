import {
  getDashboardStatsAction,
  getAllOperatorsAction,
  getAllDriversAction,
  getAllTricyclesAction,
  getSystemLogsAction,
  getAuthorityUsersAction,
} from "@/features/super-admin/actions/super-admin";
import DashboardStats from "@/features/super-admin/components/dashboard-stats";
import OperatorsTable from "@/features/super-admin/components/operators-table";
import DriversTable from "@/features/super-admin/components/drivers-table";
import TricyclesTable from "@/features/super-admin/components/tricycles-table";
import AuthorityUsersTable from "@/features/super-admin/components/authority-users-table";
import AuditLogsTable from "@/features/super-admin/components/audit-logs-table";
import LogoutButton from "@/features/super-admin/components/logout-button";
import CreateUserDialog from "@/features/super-admin/components/create-user-dialog";
import CreateAuthorityDialog from "@/features/super-admin/components/create-authority-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function SuperAdminDashboardPage() {
  const [
    stats,
    operatorsResult,
    driversResult,
    tricyclesResult,
    logsResult,
    authorityResult,
  ] = await Promise.all([
    getDashboardStatsAction(),
    getAllOperatorsAction(),
    getAllDriversAction(),
    getAllTricyclesAction(),
    getSystemLogsAction(),
    getAuthorityUsersAction(),
  ]);

  const operators = operatorsResult.data || [];
  const drivers = driversResult.data || [];
  const tricycles = tricyclesResult.data || [];
  const logs = logsResult.data || [];
  const authorityUsers = authorityResult.data || [];

  return (
    <div className="container mx-auto py-10 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage all users, operators, drivers, and system settings.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CreateUserDialog />
          <LogoutButton />
        </div>
      </div>

      <div className="mb-8">
        <DashboardStats stats={stats} />
      </div>

      <Tabs defaultValue="operators" className="space-y-4">
        <TabsList>
          <TabsTrigger value="operators">
            Operators ({operators.length})
          </TabsTrigger>
          <TabsTrigger value="drivers">Drivers ({drivers.length})</TabsTrigger>
          <TabsTrigger value="tricycles">
            Tricycles ({tricycles.length})
          </TabsTrigger>
          <TabsTrigger value="authority">
            Authority ({authorityUsers.length})
          </TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="operators" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Operators</h2>
          </div>
          <OperatorsTable data={operators} />
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <DriversTable data={drivers} operators={operators} />
        </TabsContent>

        <TabsContent value="tricycles" className="space-y-4">
          <TricyclesTable data={tricycles} operators={operators} />
        </TabsContent>

        <TabsContent value="authority" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Authority Users</h2>
            <CreateAuthorityDialog />
          </div>
          <AuthorityUsersTable data={authorityUsers} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <AuditLogsTable data={logs} operators={operators} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
