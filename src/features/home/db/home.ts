"use server";

import { ShiftLog } from "@/lib/types";
import { createClient } from "@/supabase/server";

export const fetchRecentLogs = async () => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(0, 5);

  if (error) {
    console.error("Error searching logs:", error);
    return [];
  }

  return data || [];
};

// export const fetchActiveShifts = async () => {
//   const supabase = await createClient();

//   const { data } = await supabase.rpc("fetch_active_shifts_today");
//   const activeOnly = data.filter((shift: ShiftLog) =>
//     shift.shift_type === "Time-in"
//   );

//   return activeOnly;
// };

export const fetchActiveShifts = async () => {
  const supabase = await createClient();

  // Get today's date range
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1,
  );

  const { data, error } = await supabase
    .from("shifts")
    .select("*")
    .gte("created_at", startOfDay.toISOString())
    .lt("created_at", endOfDay.toISOString())
    .order("created_at", { ascending: true }); // Order oldest to newest

  if (error) {
    console.error("Error fetching shifts:", error);
    return [];
  }

  if (!data) return [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const latestShiftsByDriver = new Map<string, any>();

  for (const shift of data) {
    const existing = latestShiftsByDriver.get(shift.driver_id);
    if (
      !existing || new Date(shift.created_at) > new Date(existing.created_at)
    ) {
      latestShiftsByDriver.set(shift.driver_id, shift);
    }
  }

  const activeShifts = Array.from(latestShiftsByDriver.values()).filter(
    (shift) => shift.shift_type === "Time-in",
  );

  return activeShifts;
};
