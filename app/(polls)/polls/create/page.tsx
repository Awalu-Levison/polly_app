import CreatePollForm from '@/components/polls/CreatePollForm';
import { redirect } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export default async function CreatePollPage() {
  const supabase = getSupabaseAdmin();

  // Get the current session and user
  const { data } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();

  // Check if user is authenticated
  if (!user || !data.session) {
    redirect('/sign-in');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Create a New Poll</h1>
      <CreatePollForm userId={user.id} />
    </div>
  );
}