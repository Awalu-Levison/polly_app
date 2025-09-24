import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PollDetailPage from '@/app/(polls)/polls/[id]/page';
import { getPoll } from '@/lib/actions/polls';
import { getSupabaseAdmin } from '@/lib/supabase/server';

// Mock the dependencies
jest.mock('@/lib/actions/polls', () => ({
  getPoll: jest.fn(),
}));

jest.mock('@/lib/supabase/server', () => ({
  getSupabaseAdmin: jest.fn(),
}));

jest.mock('@/components/polls/PollVotingForm', () => ({
  __esModule: true,
  default: function MockPollVotingForm({ poll, userId }: { poll: any, userId: string }) {
    return <div data-testid="mock-voting-form">Voting Form Mock</div>;
  },
}));

jest.mock('@/components/polls/QRCodeShare', () => ({
  __esModule: true,
  default: function MockQRCodeShare({ pollId }: { pollId: string }) {
    return <div data-testid="mock-qr-share" data-poll-id={pollId}>QR Share Mock</div>;
  },
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('PollDetailPage', () => {
  const mockPoll = {
    id: 'poll-123',
    question: 'Test Poll',
    description: 'This is a test poll',
    created_at: '2023-01-01T00:00:00Z',
    options: [
      { id: 'option-1', option_text: 'Option 1' },
      { id: 'option-2', option_text: 'Option 2' },
    ],
  };

  const mockUser = { id: 'user-123' };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock getPoll to return the mock poll
    (getPoll as jest.Mock).mockResolvedValue(mockPoll);
    
    // Mock getSupabaseAdmin to return a mock client with auth.getUser
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    };
    (getSupabaseAdmin as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('renders the poll detail page with QR code sharing', async () => {
    const { findByTestId } = render(
      await PollDetailPage({ params: { id: 'poll-123' } })
    );
    
    // Check that the QR code sharing component is rendered with the correct poll ID
    const qrShare = await findByTestId('mock-qr-share');
    expect(qrShare).toBeInTheDocument();
    expect(qrShare).toHaveAttribute('data-poll-id', 'poll-123');
    
    // Check that the voting form is rendered
    const votingForm = await findByTestId('mock-voting-form');
    expect(votingForm).toBeInTheDocument();
  });
});