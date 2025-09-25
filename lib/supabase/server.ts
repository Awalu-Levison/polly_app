import { createClient } from "@supabase/supabase-js";
import { serverEnv } from "@/lib/env";
import { cookies } from 'next/headers';

// This file should only be imported in server components or server actions

// Check if we're in a server context
const isServer = typeof window === 'undefined';

// Helper function to ensure supabaseAdmin is only used server-side
export function getSupabaseAdmin() {
  if (!isServer) {
    throw new Error('getSupabaseAdmin can only be used on the server');
  }
  
  // Create a Supabase client with the service role key
  const supabase = createClient(
    serverEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      cookies: {
        get: (name) => cookies().get(name)?.value,
      }
    }
  );
  
  return supabase;
}

