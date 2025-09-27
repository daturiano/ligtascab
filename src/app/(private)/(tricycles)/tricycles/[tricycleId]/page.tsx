import { fetchTricycleDetails } from "@/features/tricycles/actions/tricycles";
import TricycleProfileView from "@/features/tricycles/components/tricycle-profle-view";
import { createClient } from "@/supabase/server";

export default async function TricycleProfilePage({
  params,
}: {
  params: Promise<{ tricycleId: string }>;
}) {
  const tricycleId = (await params).tricycleId;
  const { data: tricycle } = await fetchTricycleDetails(tricycleId);
  if (!tricycle) return null;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return <TricycleProfileView user={user} tricycle={tricycle} />;
}
