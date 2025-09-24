import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";

// This file should only be imported in server components or server actions

// Check if we're in a server context
const isServer = typeof window === 'undefined';

// Use service role key (server only)
export const supabaseAdmin = isServer && serverEnv.SUPABASE_SERVICE_ROLE_KEY 
  ? createClient(
      serverEnv.NEXT_PUBLIC_SUPABASE_URL,
      serverEnv.SUPABASE_SERVICE_ROLE_KEY
    )
  : null; // Will be null on client-side

// Helper function to ensure supabaseAdmin is only used server-side
export function getSupabaseAdmin() {
  if (!isServer) {
    throw new Error('getSupabaseAdmin can only be used on the server');
  }
  
  if (!supabaseAdmin) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables');
  }
  
  return supabaseAdmin;
}

