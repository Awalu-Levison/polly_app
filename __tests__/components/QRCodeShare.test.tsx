import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QRCodeShare from '@/components/polls/QRCodeShare';

// Mock the react-qr-code module
jest.mock('react-qr-code', () => ({
  __esModule: true,
  default: function MockQRCode({ value }: { value: string }) {
    return <div data-testid="mock-qr-code" data-value={value}>QR Code Mock</div>;
  },
}));

describe('QRCodeShare Component', () => {
  const mockPollId = 'poll-123';
  const expectedUrl = `${window.location.origin}/polls/${mockPollId}`;
  
  it('renders the QR code with the correct poll URL', () => {
    render(<QRCodeShare pollId={mockPollId} />);
    
    const qrCode = screen.getByTestId('mock-qr-code');
    expect(qrCode).toBeInTheDocument();
    expect(qrCode).toHaveAttribute('data-value', expectedUrl);
  });
  
  it('displays the share link text', () => {
    render(<QRCodeShare pollId={mockPollId} />);
    
    expect(screen.getByText(/Share this poll/i)).toBeInTheDocument();
    expect(screen.getByText(expectedUrl)).toBeInTheDocument();
  });
  
  it('renders a copy button', () => {
    render(<QRCodeShare pollId={mockPollId} />);
    
    const copyButton = screen.getByRole('button', { name: /copy/i });
    expect(copyButton).toBeInTheDocument();
  });
});