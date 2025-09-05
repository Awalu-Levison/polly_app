'use client';

/**
 * Sign In Page
 *
 * This page provides a user interface for users to sign in to their account.
 * It collects email and password, simulates authentication, and redirects to the polls page on success.
 *
 * Design Intent:
 * - Simple, accessible sign-in form using reusable UI components.
 * - Placeholder for real authentication logic.
 * - Uses optimistic UI feedback (loading state) for better UX.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * SignIn React Component
 *
 * Renders a sign-in form with email and password fields.
 * On submit, simulates authentication and navigates to the polls page.
 */
/**
 * SignIn React Component
 *
 * Renders the user login form for the Polly App. This component is essential for authenticating returning users,
 * allowing them to access their account and participate in polls. It simulates authentication and redirects to the polls page upon success.
 *
 * Why it's needed:
 * - Provides a secure entry point for users, ensuring that only authenticated users can create or vote in polls.
 * - Supports the app's core workflow by gating access to personalized and persistent poll data.
 *
 * Assumptions:
 * - The actual authentication logic (API call, validation, error handling) will be implemented later; currently, it is simulated.
 * - The app expects valid credentials (email and password) for each user.
 *
 * Edge Cases:
 * - Incorrect email or password, locked accounts, or unverified emails are not currently handled but should be in production.
 * - No feedback is provided for failed login attempts in this placeholder version.
 *
 * Connections:
 * - On successful login, the user is redirected to the polls page, integrating with the main polling workflow.
 * - Provides a link to the sign-up page for new users, supporting seamless navigation between authentication flows.
 */
export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handles form submission for sign-in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement actual authentication logic
    console.log('Sign in with:', email, password);
    
    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push('/polls');
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {/* Email input field */}
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              {/* Password input field */}
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {/* Submit button with loading state */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            {/* Link to sign-up page */}
            <div className="text-sm text-center">
              Don't have an account?{' '}
              <Link href="/sign-up" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}