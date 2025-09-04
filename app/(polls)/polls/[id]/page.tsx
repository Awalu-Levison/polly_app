'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { use } from 'react';

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
  // Unwrap the params Promise using React.use()
  const unwrappedParams = use(params);
  const pollId = unwrappedParams.id;
  
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        // TODO: Replace with actual API call
        // Simulate API call
        setTimeout(() => {
          const mockPoll: Poll = {
            id: pollId,
            title: pollId === '1' ? 'Favorite Programming Language' : 'Sample Poll',
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
          setPoll(mockPoll);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch poll:', error);
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  const handleVote = async () => {
    if (!selectedOption) return;
    
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update UI optimistically
      if (poll) {
        const updatedOptions = poll.options.map(option => {
          if (option.id === selectedOption) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });
        
        setPoll({
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
        });
        
        setHasVoted(true);
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Poll not found</h1>
        <p className="mb-6">The poll you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/polls')}>Back to Polls</Button>
      </div>
    );
  }

  const calculatePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  };

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
            <div className="space-y-4">
              <h3 className="font-medium">Results:</h3>
              {poll.options.map((option) => (
                <div key={option.id} className="space-y-1">
                  <div className="flex justify-between">
                    <span>{option.text}</span>
                    <span>{calculatePercentage(option.votes)}% ({option.votes} votes)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${calculatePercentage(option.votes)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <p className="text-sm text-gray-500 mt-4">Total votes: {poll.totalVotes}</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); handleVote(); }} className="space-y-6">
              <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
                <div className="space-y-3">
                  {poll.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <label htmlFor={option.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option.text}
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              <Button type="submit" disabled={!selectedOption || isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Vote'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}