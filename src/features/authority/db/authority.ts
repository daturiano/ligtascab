import { createClient } from "@/supabase/server";

export const getPendingRequests = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pending_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (data) {
    for (const request of data) {
      if (request.payload?.documents) {
        const signedDocs: Record<string, string> = {};
        for (const [key, path] of Object.entries(request.payload.documents)) {
          if (typeof path === "string") {
            const { data: signedData } = await supabase.storage
              .from("documents")
              .createSignedUrl(path, 3600);
            if (signedData) {
              signedDocs[key] = signedData.signedUrl;
            }
          }
        }
        request.payload.signedDocuments = signedDocs;
      }
    }
  }

  return { data, error };
};

export const getPendingRequestById = async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pending_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (data) {
    if (data.payload?.documents) {
      const signedDocs: Record<string, string> = {};
      for (const [key, path] of Object.entries(data.payload.documents)) {
        if (typeof path === "string") {
          const { data: signedData } = await supabase.storage
            .from("documents")
            .createSignedUrl(path, 3600);
          if (signedData) {
            signedDocs[key] = signedData.signedUrl;
          }
        }
      }
      data.payload.signedDocuments = signedDocs;
    }
  }

  return { data, error };
};
