import { getPoll } from "@/lib/actions/polls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PollVotingForm from "@/components/polls/PollVotingForm";
import QRCodeShare from "@/components/polls/QRCodeShare";
import { getSupabaseAdmin } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PollDetailPage({ params }: { params: { id: string } }) {
  const poll = await getPoll(params.id);
  const supabase = getSupabaseAdmin();
  // Make user optional since users don't need to be logged in to vote
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!poll) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Poll not found</h1>
        <p className="mb-6">The poll you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => redirect('/polls')}>Back to Polls</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" className="mb-6" onClick={() => redirect('/polls')}>
        ← Back to Polls
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{poll.question}</CardTitle>
              <CardDescription>
                Created on {new Date(poll.created_at).toLocaleDateString()}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{poll.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <PollVotingForm poll={poll} userId={user?.id || ''} />
            </div>
            <div>
              <QRCodeShare pollId={poll.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
