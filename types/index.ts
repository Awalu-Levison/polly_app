// Database table types matching Supabase schema

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

// Poll categories
export interface PollCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
}

// Poll tags
export interface PollTag {
  id: string;
  name: string;
  color?: string;
  created_at: string;
}

// Poll tag assignments (many-to-many)
export interface PollTagAssignment {
  poll_id: string;
  tag_id: string;
}

// Poll options
export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  created_at: string;
  vote_count?: number; // Computed field
}

// Main polls table
export interface Poll {
  id: string;
  user_id: string;
  title?: string;
  question: string;
  description?: string;
  allow_multiple_votes: boolean;
  allow_anonymous: boolean;
  max_votes_per_user: number;
  is_public: boolean;
  is_active: boolean;
  expires_at?: string;
  vote_count: number;
  view_count: number;
  share_token: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  options?: PollOption[];
  category?: PollCategory;
  tags?: PollTag[];
  user?: User;
}

// Votes table
export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  user_id?: string;
  vote_token?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  created_at: string;
  
  // Relations
  option?: PollOption;
  user?: User;
}

// Poll participants
export interface PollParticipant {
  id: string;
  poll_id: string;
  user_id?: string;
  participant_token?: string;
  first_participated_at: string;
  last_participated_at: string;
  vote_count: number;
  
  // Relations
  user?: User;
}

// Poll analytics
export interface PollAnalytics {
  id: string;
  poll_id: string;
  event_type: 'view' | 'vote' | 'share' | 'qr_scan';
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  created_at: string;
  
  // Relations
  user?: User;
}

// Poll shares
export interface PollShare {
  id: string;
  poll_id: string;
  shared_by_user_id?: string;
  share_method: 'link' | 'qr' | 'social' | 'embed';
  platform?: string;
  created_at: string;
  
  // Relations
  shared_by_user?: User;
}

// Poll comments
export interface PollComment {
  id: string;
  poll_id: string;
  user_id?: string;
  comment_text: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: User;
}

// Poll reports
export interface PollReport {
  id: string;
  poll_id: string;
  reported_by_user_id?: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewed_by_user_id?: string;
  reviewed_at?: string;
  created_at: string;
  
  // Relations
  reported_by_user?: User;
  reviewed_by_user?: User;
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
  total?: number;
  page?: number;
  limit?: number;
}

export interface PollResponse {
  poll: Poll;
}

export interface PollOptionsResponse {
  options: PollOption[];
}

export interface VoteResponse {
  vote: Vote;
  success: boolean;
  message?: string;
}

export interface AnalyticsResponse {
  analytics: PollAnalytics[];
  summary: {
    total_views: number;
    total_votes: number;
    total_shares: number;
    unique_participants: number;
  };
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

// Form types for creating/updating polls
export interface CreatePollForm {
  title?: string;
  question: string;
  description?: string;
  options: string[];
  allow_multiple_votes?: boolean;
  allow_anonymous?: boolean;
  max_votes_per_user?: number;
  is_public?: boolean;
  expires_at?: string;
  category_id?: string;
  tag_ids?: string[];
}

export interface UpdatePollForm extends Partial<CreatePollForm> {
  id: string;
}

// Vote form types
export interface VoteForm {
  poll_id: string;
  option_ids: string[]; // Array to support multiple votes
  vote_token?: string; // For anonymous voting
}

// Search and filter types
export interface PollFilters {
  category_id?: string;
  tag_ids?: string[];
  is_public?: boolean;
  is_active?: boolean;
  user_id?: string;
  search?: string;
  sort_by?: 'created_at' | 'vote_count' | 'view_count' | 'title';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Dashboard types
export interface DashboardStats {
  total_polls: number;
  total_votes: number;
  total_views: number;
  active_polls: number;
  recent_polls: Poll[];
  popular_polls: Poll[];
  recent_activity: (PollAnalytics | PollShare)[];
}

// QR Code types
export interface QRCodeData {
  poll_id: string;
  share_token: string;
  url: string;
  title?: string;
}

// Share types
export interface ShareData {
  poll_id: string;
  share_token: string;
  url: string;
  title: string;
  description?: string;
  qr_code_url?: string;
}