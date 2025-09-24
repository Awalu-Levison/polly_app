'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPollAction } from '@/lib/actions/polls';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>{pending ? "Creating..." : "Create Poll"}</Button>
  );
}

export default function CreatePollForm({ userId }: { userId: string }) {
  const [state, formAction] = useFormState(createPollAction, null);
  const [options, setOptions] = useState(['', '']);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const addOption = () => setOptions((opts) => [...opts, '']);
  const removeOption = (idx: number) => setOptions((opts) => opts.length > 2 ? opts.filter((_, i) => i !== idx) : opts);

  return (
    <form action={formAction} className="space-y-4 max-w-md mx-auto">
      <Input
        name="title"
        placeholder="Poll Title / question"
        required
      />
      <Textarea
        name="description"
        placeholder="Description (optional)"
      />
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex gap-2">
            <Input
              name="options"
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={e => handleOptionChange(idx, e.target.value)}
              required
            />
            {options.length > 2 && (
              <Button type="button" variant="destructive" onClick={() => removeOption(idx)}>-</Button>
            )}
          </div>
        ))}
        <Button type="button" onClick={addOption} variant="secondary">Add Option</Button>
      </div>
      <input type="hidden" name="userId" value={userId} />
      {state?.error && <div className="text-red-500 text-sm">{state.error}</div>}
      <SubmitButton />
    </form>
  );
}