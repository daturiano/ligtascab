"use server";

import { createLog, uploadDocument } from "@/db/db";
import { AttachmentDetails, Tricycle } from "@/lib/types";
import { createClient } from "@/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { TricycleFormData } from "../components/create-tricycle-provider";
import {
  createTricycle,
  deleteTricycle,
  getAllTricycles,
  getAllTricycleShiftLogs,
  getTricycleById,
  updateTricycle,
} from "../db/tricycles";
import { TricycleUpdateSchema } from "../schemas/tricycle";
import { getErrorMessage } from "@/lib/utils";

export const fetchTricycleDetails = async (
  id: string,
): Promise<{ data: Tricycle }> => {
  const { data, error } = await getTricycleById(id);

  if (error || !data) {
    throw new Error(error?.message || "Tricycle not found");
  }

  return { data };
};

export const fetchAllTricyclesFromOperator = async (): Promise<{
  data: Tricycle[];
}> => {
  const { data, error } = await getAllTricycles();

  if (error || !data) {
    throw new Error(error?.message || "Unable to fetch all tricycles");
  }

  return { data };
};

export async function createNewTricycle(
  tricycleFormData: TricycleFormData,
): Promise<{ data: Tricycle }> {
  try {
    const { tricycleDetails, complianceDetails, maintenanceDetails } =
      tricycleFormData as {
        tricycleDetails: NonNullable<typeof tricycleFormData.tricycleDetails>;
        complianceDetails: NonNullable<
          typeof tricycleFormData.complianceDetails
        >;
        maintenanceDetails: NonNullable<
          typeof tricycleFormData.maintenanceDetails
        >;
      };

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    const tricycleData = {
      operator_id: user.id,
      tricycle_details: {
        model: tricycleDetails.model,
        year: tricycleDetails.year,
        seating_capacity: tricycleDetails.seating_capacity,
        body_number: tricycleDetails.body_number,
        fuel_type: tricycleDetails.fuel_type,
        mileage: maintenanceDetails.mileage,
        maintenance_status: maintenanceDetails.maintenance_status,
      },
      compliance_details: {
        registration_number: tricycleDetails.registration_number,
        franchise_number: complianceDetails.franchise_number,
        or_number: complianceDetails.or_number,
        cr_number: complianceDetails.cr_number,
      },
      plate_number: complianceDetails.plate_number,
      registration_expiration: tricycleDetails.registration_expiration,
      franchise_expiration: complianceDetails.franchise_expiration,
      last_maintenance_date: maintenanceDetails.last_maintenance_date,
    };

    console.log(tricycleData);

    const { data: tricycle, error } = await createTricycle(tricycleData);

    if (error || !tricycle) {
      throw new Error(error?.message || "Unable to create new tricycle");
    }

    const logData = {
      data: tricycleData,
      operator_id: user.id,
      tricycle_id: tricycle.id,
      log_event: "create_tricycle",
    };

    const { error: logError } = await createLog(logData);

    if (logError) {
      throw new Error(logError.message || "Unable to log create tricycle");
    }

    return { data: tricycle };
  } catch (err) {
    throw new Error(getErrorMessage(err));
  }
}

export const removeTricycleFromOperator = async (
  tricycle_id: string,
): Promise<{ data: Tricycle }> => {
  const { data, error } = await deleteTricycle(tricycle_id);

  if (error || !data) {
    throw new Error(error?.message || "Failed to delete tricycle");
  }

  return { data };
};

export const uploadTricycleDocument = async (
  tricycle_id: string,
  attachmentDetails: AttachmentDetails,
) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: tricycle, error } = await getTricycleById(tricycle_id);

  if (error || !tricycle) {
    throw new Error(error?.message || "Unable to fetch tricycle by id");
  }

  const bucket_name = "documents";
  const results = await uploadDocument(
    attachmentDetails,
    bucket_name,
    "tricycles",
    tricycle.id,
  );

  const logData = {
    data: { results },
    operator_id: user.id,
    tricycle_id: tricycle.id,
    log_event: "tricycle_documents",
  };

  const { error: LogError } = await createLog(logData);

  if (LogError) {
    throw new Error(
      LogError.message || "unable to create log for update tricycle document",
    );
  }
};

export const fetchAllTricycleShiftLogs = async (id: string) => {
  const { data: tricycle_logs, error } = await getAllTricycleShiftLogs(id);

  if (error || !tricycle_logs) {
    throw new Error(error?.message || "Unable to fetch tricycle shift logs");
  }

  return tricycle_logs;
};

export const updateTricycleInformation = async (
  formData: z.infer<typeof TricycleUpdateSchema>,
  id: string,
): Promise<{ data: Tricycle }> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User is not authenticated");
  }

  const { data: currentTricycleData, error } = await getTricycleById(id);

  if (error || !currentTricycleData) {
    throw new Error(error?.message || "Current tricycle data does not exist");
  }

  const mergedData = {
    ...currentTricycleData,
    ...formData,
    tricycle_details: {
      ...currentTricycleData.tricycle_details,
      ...formData.tricycle_details,
    },
    compliance_details: {
      ...currentTricycleData.compliance_details,
      ...formData.compliance_details,
    },
  };

  const { data: tricycle, error: updateError } = await updateTricycle(
    mergedData,
    id,
  );

  if (updateError || !tricycle) {
    throw new Error(updateError?.message || "Unable to update tricycle");
  }

  revalidatePath(`/tricycles/${id}`);

  return { data: tricycle };
};
