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
  suspendUserAction,
  unsuspendUserAction,
} from "../actions/user-management";
import { deleteOperatorAction } from "../actions/super-admin";
import { getErrorMessage, getFormattedDate } from "@/lib/utils";

interface OperatorActionsProps {
  operatorId: string;
  currentStatus?: string;
}

export default function OperatorActions({
  operatorId,
  currentStatus,
}: OperatorActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSuspend = async () => {
    setIsLoading(true);
    try {
      const { error } = await suspendUserAction({ userId: operatorId });
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success("Operator suspended successfully");
        router.refresh();
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { description: getFormattedDate() });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    setIsLoading(true);
    try {
      const { error } = await unsuspendUserAction(operatorId);
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success("Operator unsuspended successfully");
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
      const { error } = await deleteOperatorAction(operatorId);
      if (error) {
        toast.error(getErrorMessage(error), { description: getFormattedDate() });
      } else {
        toast.success("Operator deleted successfully");
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
      {currentStatus === "suspended" ? (
        <Button
          variant="outline"
          onClick={handleUnsuspend}
          disabled={isLoading}
        >
          <CheckCircle className="mr-2 h-4 w-4" /> Unsuspend
        </Button>
      ) : (
        <Button variant="outline" onClick={handleSuspend} disabled={isLoading}>
          <Ban className="mr-2 h-4 w-4" /> Suspend
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
            <AlertDialogTitle>Delete Operator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this operator? This will
              permanently remove the operator and their authentication account.
              This action cannot be undone.
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
