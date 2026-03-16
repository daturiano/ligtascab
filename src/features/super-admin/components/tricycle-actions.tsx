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
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  deleteTricycleAction,
  updateTricycleAction,
} from "../actions/super-admin";
import { getErrorMessage, getFormattedDate } from "@/lib/utils";

interface TricycleActionsProps {
  tricycleId: string;
  currentStatus?: string;
}

export default function TricycleActions({
  tricycleId,
  currentStatus,
}: TricycleActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    setIsLoading(true);
    try {
      const { error } = await updateTricycleAction({
        id: tricycleId,
        status: newStatus,
      });
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success(`Tricycle status updated to ${newStatus}`);
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
      const { error } = await deleteTricycleAction(tricycleId);
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success("Tricycle deleted successfully");
        router.push("/super-admin/dashboard");
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { description: getFormattedDate() });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-4">
      {currentStatus !== "active" && (
        <Button
          variant="outline"
          onClick={() => handleStatusChange("active")}
          disabled={isLoading}
        >
          Set Active
        </Button>
      )}
      {currentStatus !== "inactive" && (
        <Button
          variant="outline"
          onClick={() => handleStatusChange("inactive")}
          disabled={isLoading}
        >
          Set Inactive
        </Button>
      )}
      {currentStatus !== "suspended" && (
        <Button
          variant="outline"
          onClick={() => handleStatusChange("suspended")}
          disabled={isLoading}
        >
          Suspend
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" disabled={isLoading}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tricycle</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tricycle? This will
              permanently remove the tricycle record. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
