import { createClient as supabaseCreateClient } from "@supabase/supabase-js";
import { clientEnv } from "@/lib/env";

// Use anon key (safe for client) with proper session persistence
export const supabaseClient = supabaseCreateClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Export a function that creates and returns a client with session persistence
export const createClient = () => supabaseCreateClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);


