import { createClient as supabaseCreateClient } from "@supabase/supabase-js";
import { clientEnv } from "@/lib/env";

// Use anon key (safe for client)
export const supabaseClient = supabaseCreateClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Export a function that creates and returns a client
export const createClient = () => supabaseCreateClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
);


