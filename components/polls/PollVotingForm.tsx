'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { submitVote } from '@/lib/actions/polls';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';
import { Poll } from '@/types';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit Vote'}
    </Button>
  );
}

export default function PollVotingForm({ poll, userId }: { poll: Poll, userId: string }) {
  const [state, formAction] = useFormState(submitVote, null);
  const [selectedOption, setSelectedOption] = useState('');

  return (
    <form action={formAction}>
      <input type="hidden" name="pollId" value={poll.id} />
      <input type="hidden" name="userId" value={userId} />
      <RadioGroup name="optionId" value={selectedOption} onValueChange={setSelectedOption}>
        <div className="space-y-3">
          {poll.options?.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <label htmlFor={option.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {option.option_text}
              </label>
            </div>
          ))}
        </div>
      </RadioGroup>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
