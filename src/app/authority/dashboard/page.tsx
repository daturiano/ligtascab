import {
  getPendingRequestsAction,
  getReportsAction,
} from "@/features/authority/actions/authority";
import {
  getDashboardStatsAction,
  getAllOperatorsAction,
  getAllDriversAction,
  getAllTricyclesAction,
  getSystemLogsAction,
  suspendUserAction,
  unsuspendUserAction,
} from "@/features/authority/actions/entity-management";
import PendingRequestsTable from "@/features/authority/components/pending-requests-table";
import ReportsTable from "@/features/authority/components/reports-table";
import LogoutButton from "@/features/authority/components/logout-button";
import DashboardStats from "@/features/super-admin/components/dashboard-stats";
import OperatorsTable from "@/features/super-admin/components/operators-table";
import DriversTable from "@/features/super-admin/components/drivers-table";
import TricyclesTable from "@/features/super-admin/components/tricycles-table";
import AuditLogsTable from "@/features/super-admin/components/audit-logs-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AuthorityDashboardPage() {
  const [
    requests,
    reports,
    stats,
    operatorsResult,
    driversResult,
    tricyclesResult,
    logsResult,
  ] = await Promise.all([
    getPendingRequestsAction(),
    getReportsAction(),
    getDashboardStatsAction(),
    getAllOperatorsAction(),
    getAllDriversAction(),
    getAllTricyclesAction(),
    getSystemLogsAction(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedRequests = (requests || []).map((req: any) => ({
    ...req,
    requester: Array.isArray(req.requester) ? req.requester[0] : req.requester,
  }));

  const operators = operatorsResult.data || [];
  const drivers = driversResult.data || [];
  const tricycles = tricyclesResult.data || [];
  const logs = logsResult.data || [];

  return (
    <div className="container mx-auto py-10 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Authority Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Oversee operators, drivers, tricycles, and manage registration requests.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mb-8">
        <DashboardStats stats={stats} />
      </div>

      <Tabs defaultValue="operators" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="operators">
            Operators ({operators.length})
          </TabsTrigger>
          <TabsTrigger value="drivers">
            Drivers ({drivers.length})
          </TabsTrigger>
          <TabsTrigger value="tricycles">
            Tricycles ({tricycles.length})
          </TabsTrigger>
          <TabsTrigger value="requests">
            Pending Requests ({formattedRequests.length})
          </TabsTrigger>
          <TabsTrigger value="reports">
            Reports ({reports?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="operators" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Operators</h2>
          </div>
          <OperatorsTable
            data={operators}
            role="authority"
            suspendAction={suspendUserAction}
            unsuspendAction={unsuspendUserAction}
          />
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <DriversTable
            data={drivers}
            operators={operators}
            role="authority"
            suspendAction={suspendUserAction}
            unsuspendAction={unsuspendUserAction}
          />
        </TabsContent>

        <TabsContent value="tricycles" className="space-y-4">
          <TricyclesTable
            data={tricycles}
            operators={operators}
            role="authority"
          />
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Registration Requests</h2>
          </div>
          <PendingRequestsTable data={formattedRequests} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Commuter Reports</h2>
          </div>
          <ReportsTable data={reports || []} />
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <AuditLogsTable data={logs} operators={operators} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
