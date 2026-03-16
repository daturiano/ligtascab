"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Ban, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  suspendUserAction as superAdminSuspend,
  unsuspendUserAction as superAdminUnsuspend,
} from "../actions/user-management";
import { deleteDriverAction } from "../actions/super-admin";
import { getErrorMessage, getFormattedDate } from "@/lib/utils";

export type AdminRole = "super_admin" | "authority";

interface DriverActionsProps {
  driverId: string;
  userId?: string;
  currentStatus?: string;
  role?: AdminRole;
  basePath?: string;
  suspendAction?: (data: { userId: string }) => Promise<{ error: unknown }>;
  unsuspendAction?: (userId: string) => Promise<{ error: unknown }>;
}

export default function DriverActions({
  driverId,
  userId,
  currentStatus,
  role = "super_admin",
  basePath = "/super-admin",
  suspendAction = superAdminSuspend,
  unsuspendAction = superAdminUnsuspend,
}: DriverActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSuspend = async () => {
    if (!userId) {
      toast.error("Driver has no associated user account");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await suspendAction({ userId });
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success("Driver suspended successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { description: getFormattedDate() });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    if (!userId) {
      toast.error("Driver has no associated user account");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await unsuspendAction(userId);
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success("Driver unsuspended successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { description: getFormattedDate() });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const { error } = await deleteDriverAction(driverId, userId);
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success("Driver deleted successfully");
        router.push(`${basePath}/dashboard`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { description: getFormattedDate() });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      {userId && (
        <>
          {currentStatus === "suspended" ? (
            <Button
              variant="outline"
              onClick={handleUnsuspend}
              disabled={isLoading}
            >
              <CheckCircle className="mr-2 h-4 w-4" /> Unsuspend
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleSuspend}
              disabled={isLoading}
            >
              <Ban className="mr-2 h-4 w-4" /> Suspend
            </Button>
          )}
        </>
      )}

      {role === "super_admin" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Driver</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this driver? This will permanently
                remove the driver record
                {userId && " and their authentication account"}. This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
