'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/supabase/supabase-provider';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/sign-in');
    }
  }, [session, router]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <>{children}</>;
}
