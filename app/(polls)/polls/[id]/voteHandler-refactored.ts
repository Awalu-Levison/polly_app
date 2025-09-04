'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Types defined with clear interfaces for better readability
interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  options: PollOption[];
  totalVotes: number;
}

// Props interfaces for child components
interface PollResultsProps {
  options: PollOption[];
  calculatePercentage: (votes: number) => number;
  totalVotes: number;
}

interface VoteFormProps {
  options: PollOption[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  handleVote: () => Promise<void>;
  isSubmitting: boolean;
}

// Main component
export default function PollDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized mock poll data to avoid recreation on each render
  const mockPoll = useMemo<Poll>(() => ({
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
  }), [params.id]);

  // Fetch poll data
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        // TODO: Replace with actual API call
        // Using setTimeout with the memoized mock data
        setTimeout(() => {
          setPoll(mockPoll);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch poll:', error);
        setError('Failed to load poll data. Please try again.');
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [mockPoll]);

  // Handle vote submission with proper error handling
  const handleVote = useCallback(async () => {
    if (!selectedOption || !poll) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // TODO: Replace with actual API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      
      // Update UI optimistically with functional state update
      setPoll((prevPoll) => {
        if (!prevPoll) return null;
        
        // Create new options array with updated vote count
        const updatedOptions = prevPoll.options.map((option) => 
          option.id === selectedOption 
            ? { ...option, votes: option.votes + 1 }
            : option
        );
        
        // Return new poll object with updated values
        return {
          ...prevPoll,
          options: updatedOptions,
          totalVotes: prevPoll.totalVotes + 1,
        };
      });
      
      setHasVoted(true);
    } catch (error) {
      console.error('Failed to submit vote:', error);
      setError('Failed to submit your vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedOption, poll]);

  // Memoized percentage calculation function
  const calculatePercentage = useCallback((votes: number): number => {
    if (!poll || poll.totalVotes === 0) return 0;
    return Math.round((votes / poll.totalVotes) * 100);
  }, [poll?.totalVotes]);

  // Navigate back to polls list
  const handleBackClick = useCallback(() => {
    router.push('/polls');
  }, [router]);

  // Render loading state
  if (isLoading) {
    return <LoadingSpinner /> as React.ReactElement;
  }

  // Render error state
  if (error) {
    return <ErrorMessage message={error} onBackClick={handleBackClick} /> as React.ReactElement;
  }

  // Render poll not found state
  if (!poll) {
    return <PollNotFound onBackClick={handleBackClick} />;
  }

  // Render poll details
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" className="mb-6" onClick={handleBackClick}>
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

// Extracted components for better organization

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Error message component
function ErrorMessage({ message, onBackClick }: { message: string, onBackClick: () => void }) {
  return (
    <div className="container mx-auto py-8 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Error</h1>
      <p className="mb-6 text-red-500">{message}</p>
      <Button onClick={onBackClick}>Back to Polls</Button>
    </div>
  );
}

// Poll not found component
function PollNotFound({ onBackClick }: { onBackClick: () => void }) {
  return (
    <div className="container mx-auto py-8 px-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Poll not found</h1>
      <p className="mb-6">The poll you're looking for doesn't exist or has been removed.</p>
      <Button onClick={onBackClick}>Back to Polls</Button>
    </div>
  );
}

// Poll results component
function PollResults({ options, calculatePercentage, totalVotes }: PollResultsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Results:</h3>
      {options.map((option) => (
        <ResultBar 
          key={option.id}
          option={option}
          percentage={calculatePercentage(option.votes)}
        />
      ))}
      <p className="text-sm text-gray-500 mt-4">Total votes: {totalVotes}</p>
    </div>
  );
}

// Result bar component for each option
function ResultBar({ option, percentage }: { option: PollOption, percentage: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span>{option.text}</span>
        <span>{percentage}% ({option.votes} votes)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Vote form component
function VoteForm({ options, selectedOption, setSelectedOption, handleVote, isSubmitting }: VoteFormProps) {
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    handleVote();
  }, [handleVote]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
        <div className="space-y-3">
          {options.map((option) => (
            <VoteOption 
              key={option.id}
              option={option}
              isSelected={selectedOption === option.id}
            />
          ))}
        </div>
      </RadioGroup>
      <Button type="submit" disabled={!selectedOption || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Vote'}
      </Button>
    </form>
  );
}

// Vote option component
function VoteOption({ option, isSelected }: { option: PollOption, isSelected: boolean }) {
  return (
    <div className="flex items-center space-x-2">
      <RadioGroupItem value={option.id} id={option.id} />
      <label 
        htmlFor={option.id} 
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {option.text}
      </label>
    </div>
  );
}