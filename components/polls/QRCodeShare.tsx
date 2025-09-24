'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeShareProps {
  pollId: string;
}

export default function QRCodeShare({ pollId }: QRCodeShareProps) {
  const [copied, setCopied] = useState(false);
  const pollUrl = `${window.location.origin}/polls/${pollId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Share this poll</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <QRCode value={pollUrl} size={200} />
        </div>
        
        <div className="w-full">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-sm truncate flex-1 border rounded-md p-2">
              {pollUrl}
            </div>
            <Button 
              onClick={copyToClipboard} 
              variant="outline" 
              size="sm"
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center">
            Share this QR code or link to let others vote on your poll
          </p>
        </div>
      </CardContent>
    </Card>
  );
}