"use client";

import SkeletonPage from "@/components/private/page-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchAllDriversFromOperator } from "@/features/drivers/actions/drivers";
import { Driver } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Search, SortDesc } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";

const DriverTable = dynamic(
  () => import("@/features/drivers/components/driver-table"),
  {
    ssr: false,
  },
);

const ToggleStatus = dynamic(() => import("@/components/ui/toggle-status"), {
  ssr: false,
});

export default function DriverPage() {
  const [search, setSearch] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const [statusSort, setStatusSort] = useState<string[]>(["all"]);

  const statusOptions = ["active", "inactive"];

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

  const SetIsSortedHandler = () => {
    setIsSorted((prev) => !prev);
  };

  const resetHandler = () => {
    setIsSorted(false);
    setStatusSort(["all"]);
    setSearch("");
  };

  const {
    data: driver,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["drivers"],
    queryFn: fetchAllDriversFromOperator,
  });

  if (error) {
    return <div>Error loading drivers: {error.message}</div>;
  }

  if (isLoading) {
    return <SkeletonPage />;
  }

  if (!driver) return null;

  const filteredDrivers = driver.data
    .filter((driver: Driver) => {
      const full_name = driver.first_name + " " + driver.last_name;
      return full_name.toLowerCase().includes(search.toLowerCase());
    })
    .filter((driver: Driver) => {
      if (statusSort.includes("all")) return true;
      if (!driver.status) return null;
      return statusSort.includes(driver.status?.toLowerCase());
    })
    .sort((a: Driver, b: Driver) => {
      const dateA = new Date(a.license_expiration).getTime();
      const dateB = new Date(b.license_expiration).getTime();
      return isSorted ? dateA - dateB : 0;
    });

  return (
    <div className="mx-auto mb-12 gap-4 space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Drivers</h1>
          {driver.data && (
            <Button>
              <Link href={"/create-driver"}>Create a driver</Link>
            </Button>
          )}
        </div>
        <div className="flex w-full flex-col items-center gap-2 lg:flex-row lg:gap-6">
          <Input
            startIcon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
            className="bg-card placeholder:text-muted-foreground rounded-3xl placeholder:tracking-wide"
          />
          <div className="bg-card flex h-13 w-full items-center justify-between rounded-xl px-2">
            <div className="flex items-center gap-2">
              <button
                className={`bg-card flex cursor-pointer gap-1 rounded-full border px-4 py-2 text-xs shadow-xs ${
                  isSorted ? "bg-primary text-background" : ""
                }`}
                onClick={SetIsSortedHandler}
              >
                <p className="font-normal">Sort by Expiration</p>
                <SortDesc size={14} />
              </button>
              <ToggleStatus
                statusSort={statusSort}
                toggleStatus={toggleStatus}
                statusOptions={statusOptions}
              />
            </div>
            <div className="ml-6 flex items-center">
              <Button variant={"ghost"} onClick={resetHandler}>
                <p className="text-muted-foreground text-xs font-light">
                  Reset
                </p>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DriverTable filteredDrivers={filteredDrivers} />
    </div>
  );
}
