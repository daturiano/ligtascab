import {
  getPendingRequestsAction,
  getReportsAction,
} from "@/features/authority/actions/authority";
import PendingRequestsTable from "@/features/authority/components/pending-requests-table";
import ReportsTable from "@/features/authority/components/reports-table";
import LogoutButton from "@/features/authority/components/logout-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AuthorityDashboardPage() {
  const [requests, reports] = await Promise.all([
    getPendingRequestsAction(),
    getReportsAction(),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formattedRequests = (requests || []).map((req: any) => ({
    ...req,
    // Ensure requester is properly shaped if needed, or rely on any cast in the component
    requester: Array.isArray(req.requester) ? req.requester[0] : req.requester,
  }));

  return (
    <div className="container mx-auto py-10 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Authority Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage registration requests and commuter reports.
          </p>
        </div>
        <LogoutButton />
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Pending Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
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
      </Tabs>
    </div>
  );
}
