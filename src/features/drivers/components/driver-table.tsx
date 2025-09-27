"use client";

import { Button } from "@/components/ui/button";
import { Driver } from "@/lib/types";
import { Link } from "lucide-react";
import Image from "next/image";
import React from "react";
import DriverCardMobile from "./driver-card-mobile";
import DriverCard from "./driver-card";
import emptyImage from "@/app/public/empty.svg";
import { useMobile } from "@/hooks/useMobile";

type DriverTableProps = {
  filteredDrivers: Driver[];
};

export default function DriverTable({ filteredDrivers }: DriverTableProps) {
  const isSmallScreen = useMobile({ max: 960 });

  return (
    <div className="bg-card max-h-[37rem] min-w-full overflow-y-auto rounded-2xl border-[0.3px]">
      {filteredDrivers.length <= 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Image src={emptyImage} alt="empty image" className="size-36" />
          <div className="mb-8 flex flex-col space-y-4 text-center">
            <h2 className="text-xl font-medium">
              Your drivers will appear here
            </h2>
            <h3 className="text-md text-muted-foreground">
              After you create a new driver, you will see it here.
            </h3>
          </div>
          <Button>
            <Link href={"/create-driver"}>Create a driver</Link>
          </Button>
        </div>
      ) : (
        <div className="w-full">
          {filteredDrivers?.map((driver: Driver) => {
            return (
              <div key={driver.id}>
                {isSmallScreen ? (
                  <DriverCardMobile driver={driver} />
                ) : (
                  <DriverCard driver={driver} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
