import { createClient } from "@supabase/supabase-js";

export const useSupabaseServer = () => {
  const config = useRuntimeConfig(); // no need for event
  return createClient(config.DB_URI, config.DB_SECRET);
};
