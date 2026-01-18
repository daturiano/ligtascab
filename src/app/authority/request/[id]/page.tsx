import { getPendingRequestByIdAction } from "@/features/authority/actions/authority";
import RequestDetailsView from "@/features/authority/components/request-details-view";
import { notFound } from "next/navigation";

export default async function RequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: request, error } = await getPendingRequestByIdAction(id);

  if (error || !request) {
    notFound();
  }

  return <RequestDetailsView request={request} />;
}
