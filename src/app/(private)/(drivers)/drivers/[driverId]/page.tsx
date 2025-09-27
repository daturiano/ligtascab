import { fetchDriverDetails } from "@/features/drivers/actions/drivers";
import DriverProfileView from "@/features/drivers/components/driver-profile-view";
import { createClient } from "@/supabase/server";

export default async function DriverProfilePage({
  params,
}: {
  params: Promise<{ driverId: string }>;
}) {
  const driverId = (await params).driverId;

  const { data: driver } = await fetchDriverDetails(driverId);
  if (!driver) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return <DriverProfileView driver={driver} user={user} />;
}
