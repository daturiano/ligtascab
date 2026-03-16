import supabaseAdmin from "@/supabase/admin";
import { SuperAdminStats } from "@/lib/types";

export async function getDashboardStats(): Promise<SuperAdminStats> {
  const [operatorsResult, driversResult, tricyclesResult, logsResult] =
    await Promise.all([
      supabaseAdmin.from("operators").select("id, status", { count: "exact" }),
      supabaseAdmin.from("drivers").select("id, status", { count: "exact" }),
      supabaseAdmin.from("tricycles").select("id", { count: "exact" }),
      supabaseAdmin.from("logs").select("id", { count: "exact" }),
    ]);

  const suspendedOperators =
    operatorsResult.data?.filter((op) => op.status === "suspended").length ?? 0;
  const suspendedDrivers =
    driversResult.data?.filter((d) => d.status === "suspended").length ?? 0;

  return {
    totalOperators: operatorsResult.count ?? 0,
    suspendedOperators,
    totalDrivers: driversResult.count ?? 0,
    suspendedDrivers,
    totalTricycles: tricyclesResult.count ?? 0,
    totalLogs: logsResult.count ?? 0,
  };
}

export async function getAllOperators() {
  const { data, error } = await supabaseAdmin
    .from("operators")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching operators:", error);
  }

  return { data, error };
}

export async function getAllDrivers() {
  // Fetch drivers first
  const { data: drivers, error } = await supabaseAdmin
    .from("drivers")
    .select("*")
    .order("status", { ascending: true });

  if (error || !drivers) {
    console.error("Error fetching drivers:", error);
    return { data: drivers, error };
  }

  // Get unique operator IDs
  const operatorIds = [...new Set(drivers.map((d) => d.operator_id).filter(Boolean))];

  // Fetch operators
  const { data: operators } = await supabaseAdmin
    .from("operators")
    .select("id, first_name, last_name")
    .in("id", operatorIds);

  // Create lookup map
  const operatorMap = new Map(
    operators?.map((op) => [op.id, op]) || []
  );

  // Attach operator info to drivers
  const driversWithOperators = drivers.map((driver) => ({
    ...driver,
    operators: operatorMap.get(driver.operator_id) || null,
  }));

  return { data: driversWithOperators, error: null };
}

export async function getAllTricycles() {
  // Fetch tricycles first
  const { data: tricycles, error } = await supabaseAdmin
    .from("tricycles")
    .select("*");

  if (error || !tricycles) {
    console.error("Error fetching tricycles:", error);
    return { data: tricycles, error };
  }

  // Get unique operator IDs
  const operatorIds = [...new Set(tricycles.map((t) => t.operator_id).filter(Boolean))];

  // Fetch operators
  const { data: operators } = await supabaseAdmin
    .from("operators")
    .select("id, first_name, last_name")
    .in("id", operatorIds);

  // Create lookup map
  const operatorMap = new Map(
    operators?.map((op) => [op.id, op]) || []
  );

  // Attach operator info to tricycles
  const tricyclesWithOperators = tricycles.map((tricycle) => ({
    ...tricycle,
    operators: operatorMap.get(tricycle.operator_id) || null,
  }));

  return { data: tricyclesWithOperators, error: null };
}

export async function getSystemLogs(limit: number = 100) {
  const { data: logs, error } = await supabaseAdmin
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !logs) {
    console.error("Error fetching logs:", error);
    return { data: logs, error };
  }

  // Get unique operator and driver IDs
  const operatorIds = [...new Set(logs.map((l) => l.operator_id).filter(Boolean))];
  const driverIds = [...new Set(logs.map((l) => l.driver_id).filter(Boolean))];

  // Fetch operators and drivers in parallel
  const [operatorsResult, driversResult] = await Promise.all([
    operatorIds.length > 0
      ? supabaseAdmin.from("operators").select("id, first_name, last_name").in("id", operatorIds)
      : { data: [] },
    driverIds.length > 0
      ? supabaseAdmin.from("drivers").select("id, first_name, last_name").in("id", driverIds)
      : { data: [] },
  ]);

  // Create lookup maps
  const operatorMap = new Map(
    operatorsResult.data?.map((op) => [op.id, op]) || []
  );
  const driverMap = new Map(
    driversResult.data?.map((d) => [d.id, d]) || []
  );

  // Attach info to logs
  const logsWithRelations = logs.map((log) => ({
    ...log,
    operators: operatorMap.get(log.operator_id) || null,
    drivers: driverMap.get(log.driver_id) || null,
  }));

  return { data: logsWithRelations, error: null };
}

export async function getOperatorById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("operators")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
}

export async function getDriverById(id: string) {
  const { data: driver, error } = await supabaseAdmin
    .from("drivers")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !driver) {
    return { data: driver, error };
  }

  // Fetch operator info
  if (driver.operator_id) {
    const { data: operator } = await supabaseAdmin
      .from("operators")
      .select("id, first_name, last_name")
      .eq("id", driver.operator_id)
      .single();

    return { data: { ...driver, operators: operator }, error: null };
  }

  return { data: { ...driver, operators: null }, error: null };
}

export async function getTricycleById(id: string) {
  const { data: tricycle, error } = await supabaseAdmin
    .from("tricycles")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !tricycle) {
    return { data: tricycle, error };
  }

  // Fetch operator info
  if (tricycle.operator_id) {
    const { data: operator } = await supabaseAdmin
      .from("operators")
      .select("id, first_name, last_name")
      .eq("id", tricycle.operator_id)
      .single();

    return { data: { ...tricycle, operators: operator }, error: null };
  }

  return { data: { ...tricycle, operators: null }, error: null };
}
