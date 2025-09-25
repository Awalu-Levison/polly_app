"use server";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { z } from "zod";
import { redirect } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
});

export async function signUp(prevState: unknown, formData: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success) {
    return {
      error: "Invalid form data",
    };
  }

  const { email, password, fullName } = result.data;

  const supabase = getSupabaseAdmin();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return {
      error: authError.message,
    };
  }

  if (authData.user) {
    // First check if profile exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select()
      .eq("id", authData.user.id)
      .single();
      
    let profileError;
    
    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from("profiles")
        .update({ name: fullName })
        .eq("id", authData.user.id);
      profileError = error;
    } else {
      // Insert new profile
      const { error } = await supabase
        .from("profiles")
        .insert([{ id: authData.user.id, name: fullName, email: email }]);
      profileError = error;
    }

    if (profileError) {
      return {
        error: profileError.message,
      };
    }
    
    // Sign in the user immediately after successful sign-up
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    redirect('/polls');
  }

  return {
    message: "Sign-up successful! Please check your email to verify your account.",
  };
}

const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function signIn(prevState: unknown, formData: FormData) {
    const result = signInSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
        return {
            error: "Invalid form data",
        };
    }

    const { email, password } = result.data;
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return {
            error: error.message,
        };
    }

    // Ensure the session is set in cookies
    if (data && data.session) {
        // Set cookies explicitly if needed
        // This is handled by Supabase's cookie management
    }

    redirect('/polls');
}

export async function signOut() {
    const supabase = getSupabaseAdmin();
    await supabase.auth.signOut();
    redirect('/');
}
