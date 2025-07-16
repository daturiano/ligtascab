"use server";

import {
  AttachmentDetails,
  MaintenanceRecords,
  ShiftLog,
  Tricycle,
} from "@/lib/types";
import { createClient } from "@/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { cache } from "react";
import { CreateTricycle, TricycleUpdate } from "../schemas/tricycle";

export const getAllTricycles = cache(
  async (): Promise<{ data: Tricycle[]; error: PostgrestError | null }> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("tricycles")
      .select("*", { count: "exact" })
      .order("status", { ascending: true });

    return {
      data: data ?? [],
      error,
    };
  },
);

export const getTricycleByPlateNumber = async (
  plate_number: string,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tricycles")
    .select("*")
    .eq("plate_number", plate_number)
    .single();

  return { data, error };
};

export async function deleteTricycle(tricycle_id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tricycles")
    .delete()
    .eq("id", tricycle_id)
    .select()
    .single();

  return { data, error };
}

export const createTricycle = async (tricycleData: CreateTricycle) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tricycles")
    .upsert([tricycleData])
    .select()
    .single();

  return { data, error };
};

export const getTricycleById = async (
  tricycle_id: string,
): Promise<{ data: Tricycle; error: PostgrestError | null }> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tricycles")
    .select("*")
    .eq("id", tricycle_id)
    .single();

  return { data, error };
};

export const uploadDocuments = async (
  attachmentDetails: AttachmentDetails,
  bucketName: string = "documents",
  tricycle_id: string,
) => {
  const results: Record<string, string | null> = {};

  for (const key in attachmentDetails) {
    const { file, documentId, documentTitle } = attachmentDetails[key];

    if (!file) {
      results[documentId] = null;
      continue;
    }

    const sanitizedTitle = documentTitle
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    const fileExtension = file.name.split(".").pop();

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const path =
      `${user?.id}/tricycles/${tricycle_id}/${documentId}/${sanitizedTitle}.${fileExtension}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: true,
      });

    results[documentId] = error ? null : path;
  }

  return results;
};

export const getAllTricycleShiftLogs = cache(
  async (
    id: string,
  ): Promise<{ data: ShiftLog[]; error: PostgrestError | null }> => {
    const supabase = await createClient();
    const { data: logs, error } = await supabase
      .from("shifts")
      .select("*")
      .eq("tricycle_id", id)
      .order("created_at", { ascending: false });

    return { data: logs || [], error };
  },
);

export const updateTricycle = async (
  tricycleData: TricycleUpdate,
  tricycle_id: string,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tricycles")
    .update(tricycleData)
    .eq("id", tricycle_id)
    .select()
    .single();

  return { data, error };
};

export const getAllMaintenanceRecords = cache(
  async () => {
    const supabase = await createClient();
    const { data: records, error } = await supabase
      .from("maintenance")
      .select("*")
      .order("date", { ascending: false });

    return { data: records || [], error };
  },
);

export const createMaintenanceRecord = async (record: MaintenanceRecords) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("maintenance")
    .insert([record])
    .select()
    .single();

  return { data, error };
};
