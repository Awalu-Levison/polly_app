'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSupabase } from '@/lib/supabase/supabase-provider';
import { signOut } from '@/lib/actions/auth';

export function Navbar() {
  const pathname = usePathname();
  const { session } = useSupabase();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Polly_App</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/polls"
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/polls') ? 'text-foreground' : 'text-muted-foreground'}`}
            >
              Polls
            </Link>
            {session && (
              <Link
                href="/polls/create"
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/polls/create') ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                Create Poll
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" alt={session.user.email} />
                    <AvatarFallback>{session.user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/polls">My Polls</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action={signOut}>
                  <button type="submit" className="w-full text-left">
                    <DropdownMenuItem
                      className="cursor-pointer"
                    >
                      Log out
                    </DropdownMenuItem>
                  </button>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
