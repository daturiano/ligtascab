"use server";

import { Driver, ShiftLog } from "@/lib/types";
import { getActiveDrivers, getAllShiftLogsToday } from "../db/home";

export const fetchActiveDrivers = async (): Promise<Driver[]> => {
  const { data: active_drivers, error } = await getActiveDrivers();

  if (error) throw new Error("Unable to fetch active drivers");

  return active_drivers;
};

export const fetchAllShiftLogsToday = async (): Promise<ShiftLog[]> => {
  const { data: shift_logs, error } = await getAllShiftLogsToday();

  if (error) throw new Error("Unable to fetch all shift logs today");

  return shift_logs;
};
