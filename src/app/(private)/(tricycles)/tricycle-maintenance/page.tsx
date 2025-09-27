"use client";

import emptyImage from "@/app/public/empty.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchAllMaintenanceRecords } from "@/features/tricycles/actions/tricycles";
import { maintenance_columns } from "@/features/tricycles/components/maintenance-columns";
import { MaintenanceRecords } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const MaintenanceTable = dynamic<{
  data: MaintenanceRecords[];
  columns: ColumnDef<MaintenanceRecords, unknown>[];
}>(
  () =>
    import("@/features/tricycles/components/maintenance-table").then(
      (mod) => mod.MaintenanceTable,
    ),
  {
    ssr: false,
  },
);

const ToggleStatus = dynamic(() => import("@/components/ui/toggle-status"), {
  ssr: false,
});

export default function TricycleMaintenancePage() {
  const [search, setSearch] = useState("");
  const [statusSort, setStatusSort] = useState<string[]>(["all"]);

  const statusOptions = ["regular", "repair"];

  const toggleStatus = (status: string) => {
    if (status === "all") {
      setStatusSort(["all"]);
    } else {
      let newStatuses = statusSort.includes(status)
        ? statusSort.filter((s) => s !== status)
        : [...statusSort.filter((s) => s !== "all"), status];

      if (newStatuses.length === 0) {
        newStatuses = ["all"];
      }

      setStatusSort(newStatuses);
    }
  };

  const resetHandler = () => {
    setStatusSort(["all"]);
    setSearch("");
  };

  const { data: maintenance_records, isLoading } = useQuery({
    queryKey: ["maintenance_records"],
    queryFn: fetchAllMaintenanceRecords,
  });

  if (isLoading) {
    return (
      <Skeleton className="h-full max-h-[34rem] w-full min-w-[350px] rounded-md" />
    );
  }

  if (!maintenance_records) return null;

  const filteredMaintenance = maintenance_records
    ?.filter((record: MaintenanceRecords) =>
      record.plate_number.toLowerCase().includes(search.toLowerCase()),
    )
    ?.filter((record: MaintenanceRecords) => {
      if (statusSort.includes("all")) return true;
      if (!record.type) return null;
      return statusSort.includes(record.type.toLowerCase());
    });

  return (
    <div className="mx-auto mb-12 gap-4 space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold lg:text-3xl">
            Maintenance Records
          </h1>
          {maintenance_records && (
            <Link href={`tricycle-maintenance/create-record`}>
              <Button>Create New Record</Button>
            </Link>
          )}
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row lg:gap-6">
          <Input
            startIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by plate number"
            className="bg-card placeholder:text-muted-foreground rounded-3xl placeholder:tracking-wide"
          />
          <div className="bg-card flex h-13 w-full items-center justify-between rounded-xl px-2">
            <div className="flex items-center gap-2">
              <ToggleStatus
                statusOptions={statusOptions}
                statusSort={statusSort}
                toggleStatus={toggleStatus}
              />
            </div>
            <div className="ml-6 flex items-center">
              <div className="border-r-muted-foreground/20 h-4 border-[0.5px]"></div>
              <Button variant={"ghost"} onClick={resetHandler}>
                <p
                  className={`text-xs ${
                    search !== "" || statusSort[0] !== "all"
                      ? "font-medium"
                      : "text-muted-foreground font-light"
                  }`}
                >
                  Reset
                </p>
              </Button>
            </div>
          </div>
        </div>
      </div>
      {filteredMaintenance.length <= 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Image
            src={emptyImage}
            alt="empty image"
            className="size-36"
            loading="lazy"
          />
          <div className="mb-8 flex flex-col space-y-4 text-center">
            <h2 className="text-xl font-medium">
              Your tricycles will appear here
            </h2>
            <h3 className="text-md text-muted-foreground">
              After you create a new vehicle, you will see it here.
            </h3>
          </div>
          <Button>
            <Link href={"/create-tricycle"}>Create a vehicle</Link>
          </Button>
        </div>
      ) : (
        <MaintenanceTable
          data={filteredMaintenance ?? []}
          columns={maintenance_columns}
        />
      )}
    </div>
  );
}
