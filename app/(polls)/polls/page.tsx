import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getSupabaseAdmin } from '@/lib/supabase/server';

// Re-validate the page every 60 seconds
export const revalidate = 60;

type Poll = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  total_votes: number;
};

async function getPolls() {
  const supabase = getSupabaseAdmin();
  const { data: polls, error } = await supabase
    .from('polls')
    .select('id, question, description, created_at, votes(count)');

  if (error) {
    console.error('Failed to fetch polls:', error.message || error);
    return [];
  }

  return polls.map(p => ({
    id: p.id,
    title: p.question,
    description: p.description,
    createdAt: p.created_at,
    total_votes: p.votes[0]?.count || 0,
  }));
}

export default async function PollsPage() {
  const polls: Poll[] = await getPolls();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Polls</h1>
        <Button asChild>
          <Link href="/polls/create">Create New Poll</Link>
        </Button>
      </div>

      {polls.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">No polls found</h2>
          <p className="text-gray-500 mb-6">Get started by creating your first poll</p>
          <Button asChild>
            <Link href="/polls/create">Create Poll</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <Link key={poll.id} href={`/polls/${poll.id}`} className="block">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>{poll.title}</CardTitle>
                  <CardDescription>
                    {new Date(poll.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">{poll.description || 'No description provided.'}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">{poll.total_votes} votes</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}