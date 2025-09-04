'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';


// Types can be moved to types/poll.ts for reusability
type PollOption = {
  id: string;
  text: string;
  votes: number;
};

type Poll = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  options: PollOption[];
  totalVotes: number;
};


export default function PollDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState<string | null>(null); // User-facing error

  // Fetch poll data (async/await directly in useEffect) with cleanup to avoid state update on unmounted component
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        // TODO: Replace with actual API call
        const mockPoll: Poll = {
          id: params.id,
          title: params.id === '1' ? 'Favorite Programming Language' : 'Sample Poll',
          description: 'Please select your preference from the options below.',
          createdAt: new Date().toISOString(),
          options: [
            { id: '1', text: 'JavaScript', votes: 15 },
            { id: '2', text: 'Python', votes: 12 },
            { id: '3', text: 'TypeScript', votes: 8 },
            { id: '4', text: 'Java', votes: 7 },
          ],
          totalVotes: 42,
        };
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (isMounted) setPoll(mockPoll);
      } catch (err) {
        if (isMounted) setError('Failed to fetch poll. Please try again later.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [params.id]);

  // Memoize percentage calculation for performance
  const calculatePercentage = useCallback((votes: number) => {
    if (!poll || poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  }, [poll]);

  // Handle vote submission
  const handleVote = useCallback(async () => {
    if (!selectedOption || !poll) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Optimistic UI update
      setPoll(prevPoll => {
        if (!prevPoll) return null;
        const updatedOptions = prevPoll.options.map(option =>
          option.id === selectedOption
            ? { ...option, votes: option.votes + 1 }
            : option
        );
        return {
          ...prevPoll,
          options: updatedOptions,
          totalVotes: prevPoll.totalVotes + 1,
        };
      });
      setHasVoted(true);
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedOption, poll]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900" aria-label="Loading"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-6 text-red-600">{error}</p>
        <Button onClick={() => router.push('/polls')}>Back to Polls</Button>
      </div>
    );
  }

  // Poll not found state
  if (!poll) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Poll not found</h1>
        <p className="mb-6">The poll you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/polls')}>Back to Polls</Button>
      </div>
    );
  }

  // Render poll details
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" className="mb-6" onClick={() => router.push('/polls')}>
        ← Back to Polls
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{poll.title}</CardTitle>
          <CardDescription>
            Created on {new Date(poll.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">{poll.description}</p>
          {hasVoted ? (
            <PollResults
              options={poll.options}
              calculatePercentage={calculatePercentage}
              totalVotes={poll.totalVotes}
            />
          ) : (
            <VoteForm
              options={poll.options}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              handleVote={handleVote}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}


// Poll results component
function PollResults({
  options,
  calculatePercentage,
  totalVotes,
}: {
  options: PollOption[];
  calculatePercentage: (votes: number) => number;
  totalVotes: number;
}) {
  // Memoize results for performance
  const results = useMemo(() => options.map(option => ({
    ...option,
    percent: calculatePercentage(option.votes)
  })), [options, calculatePercentage]);
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Results:</h3>
      {results.map(option => (
        <div key={option.id} className="space-y-1">
          <div className="flex justify-between">
            <span>{option.text}</span>
            <span>{option.percent}% ({option.votes} votes)</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5" aria-label={`Votes for ${option.text}`}>
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${option.percent}%` }}
            ></div>
          </div>
        </div>
      ))}
      <p className="text-sm text-gray-500 mt-4">Total votes: {totalVotes}</p>
    </div>
  );
}


// Vote form component
function VoteForm({
  options,
  selectedOption,
  setSelectedOption,
  handleVote,
  isSubmitting,
}: {
  options: PollOption[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  handleVote: () => void;
  isSubmitting: boolean;
}) {
  
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleVote();
      }}
      className="space-y-6"
      aria-label="Vote form"
    >
      <RadioGroup value={selectedOption} onValueChange={setSelectedOption} className="space-y-3">
        {options.map(option => (
          <div key={option.id} className="flex items-center space-x-2">
            <RadioGroupItem value={option.id} id={option.id} aria-checked={selectedOption === option.id} />
            <label htmlFor={option.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {option.text}
            </label>
          </div>
        ))}
      </RadioGroup>
      <Button type="submit" disabled={!selectedOption || isSubmitting} aria-disabled={!selectedOption || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Vote'}
      </Button>
    </form>
  );
}
