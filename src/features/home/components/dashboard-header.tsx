import cover from "@/app/public/home-header-cover.jpg";
import CopyButton from "@/components/private/copy-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { getOperator } from "@/db/db";
import { useQuery } from "@tanstack/react-query";
import { HelpCircle, House } from "lucide-react";

export default function DashboardHeader() {
  const { data: operator, isLoading } = useQuery({
    queryKey: ["operator_header"],
    queryFn: getOperator,
  });

  if (isLoading) {
    return (
      <Skeleton className="h-full max-h-[250px] min-h-[250px] w-full rounded-md" />
    );
  }

  if (!operator) return null;

  return (
    <Card
      className="rounded-md shadow-none"
      style={{
        backgroundImage: `url(${cover.src})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <CardContent className="flex flex-col gap-10">
        <div className="hidden flex-row justify-between md:flex">
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <House size={16} />
            <p>Home</p>
            <p>/</p>
            <p>{operator.coop_name}</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            <HelpCircle />
            <p>Help & Feedback</p>
          </div>
        </div>
        <Card className="max-w-[410px] rounded-md py-4 shadow-none">
          <CardContent className="flex flex-col space-y-2 px-0 text-sm">
            <div className="flex flex-col gap-2 px-4">
              <h1 className="font-medium md:text-nowrap">
                {operator.coop_name}
              </h1>
              <Badge className="px-4 text-xs">Verified</Badge>
            </div>
            <Separator />
            <div className="flex gap-2 px-4 text-xs">
              <div className="max-w-[70px]">
                <CopyButton id={operator.id} />
                <p className="text-muted-foreground">Account ID</p>
              </div>
              <div className="bg-border border-[0.9px]"></div>
              <div className="flex flex-col justify-between">
                <p className="font-medium md:text-nowrap">
                  {operator.address.address}
                </p>
                <p className="text-muted-foreground">Location</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
