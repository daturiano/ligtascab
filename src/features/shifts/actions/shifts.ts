"use server";

import { getTricycleByPlateNumber } from "@/features/tricycles/db/tricycles";
import { Driver, ShiftLog } from "@/lib/types";
import {
  checkDriverStatus,
  createShiftLog,
  getAllShiftLogs,
  getAvailableTricycles,
  getDriverAssignedVehicle,
  getDriverMostRecentLog,
  updateDriverStatus,
  updateTricycleStatus,
} from "../db/shifts";
import { getErrorMessage, isPastDue } from "@/lib/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { getDriverById } from "@/features/drivers/db/drivers";

export const fetchDriverDetails = async (
  id: string,
): Promise<{ data: Driver; error: PostgrestError | null }> => {
  const { data, error } = await getDriverById(id);

  return { data, error };
};

export const fetchAllAvailableTricyclesFromOperator = async () => {
  const { data, error } = await getAvailableTricycles();

  if (error || !data) {
    throw new Error(error?.message || "Unable to fetch all tricycles");
  }

  return data;
};

export const createNewShiftLog = async (
  data: ShiftLog,
): Promise<{ data: ShiftLog }> => {
  try {
    let logDetails = null;
    const log = {
      driver_name: data.driver_name,
      plate_number: data.plate_number,
      shift_type: data.shift_type,
      operator_id: data.operator_id,
      driver_id: data.driver_id,
      tricycle_id: "",
      revenue_collected: data.revenue_collected,
      shift_description: data.shift_description,
    };

    const status = `${data.shift_type === "Time-in" ? "active" : "inactive"}`;

    if (log.shift_type === "Time-out") {
      const isActive = await checkDriverStatus(log.driver_id);
      if (!isActive) {
        throw new Error("Driver is not active");
      }
      const { data: assignedVehicle, error: assignedError } =
        await getDriverAssignedVehicle(log.driver_id);
      if (assignedError || !assignedVehicle) {
        throw new Error(
          assignedError?.message || "Cannot get driver assigned vehicle",
        );
      }
      log.plate_number = assignedVehicle.plate_number;
      log.tricycle_id = assignedVehicle.tricycle_id;
      const { data: shiftLogDetails, error: logError } = await createShiftLog(
        log,
      );
      if (logError || !shiftLogDetails) {
        throw new Error(logError?.message || "Unable to create shift log");
      }
      logDetails = { data: shiftLogDetails };
    }

    if (log.shift_type === "Time-in") {
      const { data: driver, error: getDriverError } = await getDriverById(
        log.driver_id,
      );

      if (getDriverError || !driver) {
        throw new Error(
          getDriverError?.message || "Cannot get driver using id",
        );
      }

      if (isPastDue(driver.license_expiration)) {
        throw new Error(
          "Driver license expiration is past due. Please renew driver's license first.",
        );
      }

      const { data: tricycle, error: getTricycleError } =
        await getTricycleByPlateNumber(log.plate_number);
      if (getTricycleError || !tricycle) {
        throw new Error(
          getTricycleError?.message || "Cannot get tricycle using plate number",
        );
      }

      if (isPastDue(tricycle.franchise_expiration)) {
        throw new Error(
          "Franchise expiration is past due. Please renew your franchise first.",
        );
      }

      if (isPastDue(tricycle.registration_expiration)) {
        throw new Error(
          "Registartion expiration is past due. Please renew your registration first.",
        );
      }

      if (isPastDue(tricycle.last_maintenance_date)) {
        throw new Error(
          "Maintenance permit is past due. Please renew your permit first.",
        );
      }

      log.tricycle_id = tricycle.id;
      const isActive = await checkDriverStatus(log.driver_id);
      if (isActive) {
        throw new Error("Driver is currently active");
      }
      const { data: shiftLogDetails, error: logError } = await createShiftLog(
        log,
      );
      if (logError || !shiftLogDetails) {
        throw new Error(logError?.message || "Unable to create shift log");
      }
      logDetails = { data: shiftLogDetails };
    }

    const isDriverUpdated = await updateDriverStatus(log.driver_id, status);
    if (!isDriverUpdated) {
      throw new Error("Cannot update driver status.");
    }
    const isTricycleUpdated = await updateTricycleStatus(
      log.plate_number,
      status,
    );
    if (!isTricycleUpdated) {
      throw new Error("Cannot update tricycle status.");
    }

    if (!logDetails) {
      throw new Error("Unable to fetch log details");
    }

    return logDetails;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const fetchAllShiftLogs = async () => {
  const { data: shift_logs, error } = await getAllShiftLogs();

  if (error) throw new Error("Unable to fetch all tricycles");

  return shift_logs;
};

export const fetchDriverMostRecentLog = async (id: string) => {
  const { data, error } = await getDriverMostRecentLog(id);

  if (error) throw new Error("Unable to fetch most recent log");

  return { data };
};
