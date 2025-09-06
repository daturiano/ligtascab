import placeholder from "@/app/public/pictures.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tricycle } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";
import { removeTricycleFromOperator } from "../actions/tricycles";
import TricycleCardOptions from "./tricycle-card-options";
import { getDriverById } from "@/features/drivers/db/drivers";

type TricycleInformationProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

type TricycleProps = {
  tricycle: Tricycle;
};

function TricycleInformation({
  title,
  description,
  children,
}: TricycleInformationProps) {
  return (
    <>
      {!children ? (
        <p className="text-base font-medium tracking-wide whitespace-nowrap">
          <span className="text-muted-foreground font-normal">{title}: </span>
          {description}
        </p>
      ) : (
        <div className="flex whitespace-nowrap">
          <p className="text-muted-foreground mr-1 font-normal">{title}:</p>
          {children}
        </div>
      )}
    </>
  );
}

export default function TricycleCard({ tricycle }: TricycleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const queryClient = useQueryClient();

  const deleteTricycleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await removeTricycleFromOperator(id);
      return data;
    },
    onSuccess: (deletedTricycle) => {
      queryClient.invalidateQueries({
        queryKey: ["tricycles"],
      });
      toast.success(`${deletedTricycle.plate_number} deleted successfully!`);
    },
    onError: () => {
      toast.error("Unable to delete tricycle.");
    },
  });

  const { data: driver } = useQuery({
    queryKey: ["driver", tricycle.id],
    queryFn: async () => {
      if (!tricycle.assigned_driver) return null;
      const { data } = await getDriverById(tricycle.assigned_driver);
      return data;
    },
  });

  const onDeleteHandler = async () => {
    deleteTricycleMutation.mutate(tricycle.id);
  };

  const TricycleStatus = () => {
    if (tricycle.status == "active") return <Badge>Active</Badge>;
    if (tricycle.status == "inactive")
      return <Badge variant={"outline"}>Inactive</Badge>;
    if (tricycle.status == "maintenance")
      return <Badge variant={"secondary"}>In Maintenance</Badge>;
  };

  return (
    <div
      className="hover:bg-background/40 flex items-center gap-8 border-b p-5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Avatar className="size-40 rounded-md">
        <AvatarImage
          src={tricycle.image ?? undefined}
          alt={tricycle.plate_number}
        />
        <AvatarFallback className="size-40 rounded-md border-1 border-white bg-gray-200">
          <Image
            src={placeholder}
            alt="placeholder image"
            width={42}
            height={42}
          />
        </AvatarFallback>
      </Avatar>
      <div className="flex w-full flex-col justify-between gap-2">
        <div className="flex items-center justify-between">
          <div className="max-w-24 min-w-24">
            <TricycleStatus />
          </div>
          <TricycleCardOptions
            tricycle_id={tricycle.id}
            isHovered={isHovered}
            isPending={deleteTricycleMutation.isPending}
            onDeleteHandler={onDeleteHandler}
          />
        </div>
        <div className="flex justify-between">
          <div className="space-y-1">
            <TricycleInformation
              title="Plate Number"
              description={tricycle.plate_number}
            />
            <TricycleInformation
              title="Franchise Number"
              description={tricycle.compliance_details.franchise_number}
            />
            <TricycleInformation title="Registration Expiration">
              <p className="font-medium tracking-wide">
                {formatDate(
                  tricycle.franchise_expiration.toLocaleString(),
                  "long",
                )}
              </p>
            </TricycleInformation>
            <TricycleInformation
              title="Most Recent Driver"
              description={`${tricycle.assigned_driver ? `${driver?.first_name} ${driver?.last_name}` : "None"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
