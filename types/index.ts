// User related types
export interface User {
  id: string;
  name: string;
  email: string;
}

// Poll related types
export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdAt: string;
  createdBy: string;
}

// Auth related types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

// API response types
export interface PollsResponse {
  polls: Poll[];
}

export interface PollResponse {
  poll: Poll;
}

export interface ErrorResponse {
  error: string;
}