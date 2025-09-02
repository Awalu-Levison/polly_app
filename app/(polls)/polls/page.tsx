'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

type Poll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  votesCount: number;
};

export default function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulate API call
        setTimeout(() => {
          const mockPolls: Poll[] = [
            {
              id: '1',
              title: 'Favorite Programming Language',
              description: 'What is your favorite programming language?',
              createdAt: new Date().toISOString(),
              votesCount: 42,
            },
            {
              id: '2',
              title: 'Best Frontend Framework',
              description: 'Which frontend framework do you prefer?',
              createdAt: new Date().toISOString(),
              votesCount: 36,
            },
            {
              id: '3',
              title: 'Remote Work Preference',
              description: 'Do you prefer working remotely or in an office?',
              createdAt: new Date().toISOString(),
              votesCount: 28,
            },
          ];
          setPolls(mockPolls);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch polls:', error);
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
                  <p className="text-gray-600">{poll.description}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-gray-500">{poll.votesCount} votes</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}