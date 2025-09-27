"use client";

import emptyImage from "@/app/public/empty.svg";
import SkeletonPage from "@/components/private/page-skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchAllTricyclesFromOperator } from "@/features/tricycles/actions/tricycles";
import { useMobile } from "@/hooks/useMobile";
import { Tricycle } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Search, SortDesc } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const ToggleStatus = dynamic(() => import("@/components/ui/toggle-status"), {
  ssr: false,
});

const TricycleCard = dynamic(
  () => import("@/features/tricycles/components/tricycle-card"),
  {
    ssr: false,
  },
);

const TricycleCardMobile = dynamic(
  () => import("@/features/tricycles/components/tricycle-card-mobile"),
  {
    ssr: false,
  },
);

export default function TricyclesPage() {
  const [search, setSearch] = useState("");
  const [isSorted, setIsSorted] = useState(false);
  const [statusSort, setStatusSort] = useState<string[]>(["all"]);

  const isSmallScreen = useMobile({ max: 960 });
  const statusOptions = ["active", "inactive", "maintenance"];

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
    data: tricycles,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["tricycles"],
    queryFn: fetchAllTricyclesFromOperator,
  });

  if (error) {
    return <div>Error loading tricycles: {error.message}</div>;
  }

  if (isLoading) return <SkeletonPage />;

  if (!tricycles) return null;

  const filteredTricycles = tricycles.data
    ?.filter((tricycle: Tricycle) =>
      tricycle.plate_number.toLowerCase().includes(search.toLowerCase()),
    )
    ?.filter((tricycle: Tricycle) => {
      if (statusSort.includes("all")) return true;
      if (!tricycle.status) return null;
      return statusSort.includes(tricycle.status.toLowerCase());
    })
    ?.sort((a: Tricycle, b: Tricycle) => {
      const dateA = new Date(a.registration_expiration).getTime();
      const dateB = new Date(b.registration_expiration).getTime();
      return isSorted ? dateA - dateB : 0;
    });

  return (
    <div className="mx-auto mb-12 gap-4 space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Tricycles</h1>
          {tricycles.data && (
            <Button>
              <Link href={"/create-tricycle"}>Create a tricycle</Link>
            </Button>
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
              <button
                className={`bg-card flex cursor-pointer gap-1 rounded-full border px-4 py-2 text-xs shadow-xs ${
                  isSorted ? "bg-primary text-background" : ""
                }`}
                onClick={SetIsSortedHandler}
              >
                <p className="font-normal whitespace-nowrap">
                  Sort by Expiration
                </p>
                <SortDesc size={14} />
              </button>
              <ToggleStatus
                statusSort={statusSort}
                toggleStatus={toggleStatus}
                statusOptions={statusOptions}
              />
            </div>
            <div className="ml-6 flex items-center">
              <div className="border-r-muted-foreground/20 h-4 border-[0.5px]"></div>
              <Button variant={"ghost"} onClick={resetHandler}>
                <p
                  className={`text-xs ${
                    isSorted || search !== "" || statusSort[0] !== "all"
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
      <div className="bg-card max-h-[37rem] min-w-full overflow-y-auto rounded-2xl border-[0.3px]">
        {filteredTricycles.length <= 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Image
              src={emptyImage}
              alt="empty image"
              className="size-36"
              placeholder="blur"
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
          <div className="w-full">
            {filteredTricycles?.map((tricycle: Tricycle) => {
              return (
                <div key={tricycle.id}>
                  {isSmallScreen ? (
                    <TricycleCardMobile tricycle={tricycle} />
                  ) : (
                    <TricycleCard tricycle={tricycle} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
