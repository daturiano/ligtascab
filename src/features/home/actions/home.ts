"use server";

import { Driver } from "@/lib/types";
import { getActiveDrivers } from "../db/home";

export const fetchActiveDrivers = async (): Promise<Driver[]> => {
  const { data: active_drivers, error } = await getActiveDrivers();

  if (error) throw new Error("Unable to fetch active drivers");

  return active_drivers;
};
