"use server";

import { getSupabaseAdmin } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createPollAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const options = formData.getAll("options") as string[];
  const userId = formData.get("userId") as string;

  try {
    const supabase = getSupabaseAdmin();
    // Insert poll (use `question / title`)
    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert([{ question: title, description, user_id: userId }])
      .select()
      .single();

      // Handle errors when inserting new poll
    if (pollError) {
      console.error("Supabase poll insert error:", pollError);
      throw new Error(pollError.message);
    }

    // Insert options (into poll_options, not options)
    const pollId = poll.id;
    const optionsData = options
      .filter(opt => opt.trim().length > 0)
      .map((poll_options) => ({
        poll_id: pollId,
        option_text: poll_options,
      }));

    const { error: optionsError } = await supabase
      .from("poll_options")
      .insert(optionsData);

      // Handle errors when inserting new options
    if (optionsError) {
      console.error("Supabase options insert error:", optionsError);
      throw new Error(optionsError.message);
    }

    redirect(`/polls/${poll.id}`);
  } catch (error) {
    console.error("createPoll failed:", error);
    return {
      error: error instanceof Error ? error.message : JSON.stringify(error),
    };
  }
}

import { Poll } from "@/types";

export async function getPoll(id: string): Promise<Poll | null> {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from('polls')
        .select(`
            *,
            poll_options (*)
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching poll:", error);
        return null;
    }

    const { poll_options, ...rest } = data;
    const poll: Poll = {
        ...rest,
        options: poll_options,
    };

    return poll;
}

export async function submitVote(formData: FormData) {
    const pollId = formData.get('pollId') as string;
    const optionId = formData.get('optionId') as string;
    const userId = formData.get('userId') as string;

    try {
        const supabase = getSupabaseAdmin();
        const { error } = await supabase
            .from('votes')
            .insert([{ poll_id: pollId, option_id: optionId, user_id: userId }]);

        if (error) {
            throw new Error(error.message);
        }

        redirect(`/polls/${pollId}`);
    } catch (error) {
        console.error("submitVote failed:", error);
        return {
            error: error instanceof Error ? error.message : JSON.stringify(error),
        };
    }
}
