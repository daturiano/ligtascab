"use server";

import { Driver, Notification, Operator, Tricycle } from "@/lib/types";
import { createClient } from "@/supabase/server";

export const getOperator = async (): Promise<Operator | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: operator, error } = await supabase
    .from("operators")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return operator;
};

export const searchTricycles = async (
  query: string,
  page: number = 0,
): Promise<Tricycle[]> => {
  if (!query.trim()) return [];

  const supabase = await createClient();
  const limit = 5;
  const offset = page * limit;

  const { data, error } = await supabase
    .from("tricycles")
    .select("*")
    .ilike("plate_number", `%${query}%`)
    .range(offset, offset + limit - 1)
    .limit(limit);

  if (error) {
    console.error("Error searching tricycles:", error);
    return [];
  }

  return data || [];
};

export const searchDrivers = async (
  query: string,
  page: number = 0,
): Promise<Driver[]> => {
  if (!query.trim()) return [];
  const supabase = await createClient();
  const limit = 5;
  const offset = page * limit;

  const searchTerms = query.trim().split(/\s+/);

  let supabaseQuery = supabase
    .from("drivers")
    .select("*")
    .range(offset, offset + limit - 1)
    .limit(limit);

  if (searchTerms.length === 1) {
    supabaseQuery = supabaseQuery.or(
      `first_name.ilike.%${searchTerms[0]}%,last_name.ilike.%${
        searchTerms[0]
      }%`,
    );
  } else {
    const [firstTerm, ...restTerms] = searchTerms;
    const lastTerm = restTerms.join(" ");

    supabaseQuery = supabaseQuery.or(
      [
        // First word in first_name, rest in last_name
        `and(first_name.ilike.%${firstTerm}%,last_name.ilike.%${lastTerm}%)`,
        // First word in last_name, rest in first_name
        `and(last_name.ilike.%${firstTerm}%,first_name.ilike.%${lastTerm}%)`,
        // Full query in first_name
        `first_name.ilike.%${query}%`,
        // Full query in last_name
        `last_name.ilike.%${query}%`,
      ].join(","),
    );
  }

  const { data, error } = await supabaseQuery;

  if (error) {
    console.error("Error searching drivers:", error);
    return [];
  }
  return data || [];
};

export const getNotifications = async (): Promise<Notification[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  return data || [];
};

export const markAsRead = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id)
    .select();
  if (error) {
    return error;
  }

  return data;
};
