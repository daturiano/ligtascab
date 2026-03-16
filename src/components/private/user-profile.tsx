import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { getOperator } from "@/db/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/features/authentication/actions/authentication";

export default function UserProfile() {
  const { data: operator, isLoading } = useQuery({
    queryKey: ["operator"],
    queryFn: getOperator,
  });

  if (isLoading) {
    return (
      <div className="bg-muted-foreground/10 size-10 animate-pulse rounded-full" />
    );
  }

  if (!operator) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="bg-muted-foreground/20 flex size-10 items-center justify-center rounded-full">
          <AvatarImage
            src={operator.image ?? undefined}
            alt={operator.first_name}
          />
          <AvatarFallback className="bg-muted-foreground/10 flex size-10 items-center justify-center rounded-full">
            <p className="font-medium">
              {operator.first_name.charAt(0).toUpperCase()}
              {operator.last_name.charAt(0).toUpperCase()}
            </p>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
