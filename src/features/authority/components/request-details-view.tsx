"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PendingRequest } from "@/lib/types";
import { format } from "date-fns";
import { ArrowLeft, Check, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  approveRequestAction,
  rejectRequestAction,
} from "../actions/authority";

export default function RequestDetailsView({
  request,
}: {
  request: PendingRequest;
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = request.payload as any;
  const address = payload.address;

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      await approveRequestAction(request.id, request.target_id);
      toast.success("Request approved successfully");
      router.push("/authority/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to approve request"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await rejectRequestAction(request.id, request.target_id, reason);
      toast.success("Request rejected");
      setRejectOpen(false);
      router.push("/authority/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject request");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/authority/dashboard">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Request</h1>
          <p className="text-muted-foreground">
            {payload.first_name} {payload.last_name} &bull; {request.action_type}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" disabled={isProcessing}>
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reject Request</DialogTitle>
                <DialogDescription>
                  Please provide a reason for rejecting this request.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder="Reason for rejection..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px]"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setRejectOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isProcessing || !reason.trim()}
                >
                  {isProcessing ? "Rejecting..." : "Reject Request"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleApprove}
            disabled={isProcessing}
          >
            {isProcessing ? "Approving..." : (
              <>
                <Check className="mr-2 h-4 w-4" /> Approve
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Personal & Address */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">Name</span>
                <span className="font-medium">
                  {payload.first_name} {payload.last_name}
                </span>
              </div>
              <Separator />
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                <span className="font-medium break-all">{payload.email || "N/A"}</span>
              </div>
              <Separator />
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">Phone</span>
                <span className="font-medium">{payload.phone_number}</span>
              </div>
              <Separator />
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">Birth Date</span>
                <span className="font-medium">
                  {payload.birth_date
                    ? format(new Date(payload.birth_date), "PPP")
                    : "N/A"}
                </span>
              </div>
              <Separator />
              <div className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">Cooperative</span>
                <span className="font-medium">{payload.coop_name || "N/A"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{address?.address}</p>
              <p className="text-muted-foreground">
                {address?.municipality}, {address?.province}
              </p>
              <p className="text-muted-foreground">{address?.postal_code}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Documents */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {payload.signedDocuments ? (
                  Object.entries(payload.signedDocuments).map(([key, url]) => (
                    <div
                      key={key}
                      className="rounded-xl border bg-card p-4 shadow-sm"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-sm font-semibold capitalize tracking-tight">
                          {key.replace(/-/g, " ")}
                        </span>
                        <Badge variant="secondary">Uploaded</Badge>
                      </div>
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted/50 border">
                        <Image
                          src={url as string}
                          alt={key}
                          fill
                          className="object-contain p-2"
                          unoptimized
                        />
                      </div>
                      <div className="mt-4 flex justify-end">
                        <a
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="outline" size="sm">
                            View Full Size
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center text-muted-foreground bg-muted/20">
                    <p>No documents uploaded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
