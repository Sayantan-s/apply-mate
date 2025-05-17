import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.DB_URI as string;
const supabaseKey = process.env.DB_SECRET as string;

export const supabase = createClient(supabaseUrl, supabaseKey);
