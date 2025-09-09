export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      polls: {
        Row: {
          id: string
          user_id: string
          title: string | null
          question: string
          description: string | null
          allow_multiple_votes: boolean
          allow_anonymous: boolean
          max_votes_per_user: number
          is_public: boolean
          is_active: boolean
          expires_at: string | null
          vote_count: number
          view_count: number
          share_token: string
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          question: string
          description?: string | null
          allow_multiple_votes?: boolean
          allow_anonymous?: boolean
          max_votes_per_user?: number
          is_public?: boolean
          is_active?: boolean
          expires_at?: string | null
          vote_count?: number
          view_count?: number
          share_token?: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          question?: string
          description?: string | null
          allow_multiple_votes?: boolean
          allow_anonymous?: boolean
          max_votes_per_user?: number
          is_public?: boolean
          is_active?: boolean
          expires_at?: string | null
          vote_count?: number
          view_count?: number
          share_token?: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          option_text: string
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_text: string
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_text?: string
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          vote_token: string | null
          ip_address: string | null
          user_agent: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          vote_token?: string | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          vote_token?: string | null
          ip_address?: string | null
          user_agent?: string | null
          session_id?: string | null
          created_at?: string
        }
      }
      poll_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
      }
      poll_tags: {
        Row: {
          id: string
          name: string
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string | null
          created_at?: string
        }
      }
      poll_tag_assignments: {
        Row: {
          poll_id: string
          tag_id: string
        }
        Insert: {
          poll_id: string
          tag_id: string
        }
        Update: {
          poll_id?: string
          tag_id?: string
        }
      }
      poll_analytics: {
        Row: {
          id: string
          poll_id: string
          event_type: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          event_type: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          event_type?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          referrer?: string | null
          created_at?: string
        }
      }
      poll_shares: {
        Row: {
          id: string
          poll_id: string
          shared_by_user_id: string | null
          share_method: string
          platform: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          shared_by_user_id?: string | null
          share_method: string
          platform?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          shared_by_user_id?: string | null
          share_method?: string
          platform?: string | null
          created_at?: string
        }
      }
      poll_participants: {
        Row: {
          id: string
          poll_id: string
          user_id: string | null
          participant_token: string | null
          first_participated_at: string
          last_participated_at: string
          vote_count: number
        }
        Insert: {
          id?: string
          poll_id: string
          user_id?: string | null
          participant_token?: string | null
          first_participated_at?: string
          last_participated_at?: string
          vote_count?: number
        }
        Update: {
          id?: string
          poll_id?: string
          user_id?: string | null
          participant_token?: string | null
          first_participated_at?: string
          last_participated_at?: string
          vote_count?: number
        }
      }
      poll_comments: {
        Row: {
          id: string
          poll_id: string
          user_id: string | null
          comment_text: string
          is_approved: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          user_id?: string | null
          comment_text: string
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          user_id?: string | null
          comment_text?: string
          is_approved?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      poll_reports: {
        Row: {
          id: string
          poll_id: string
          reported_by_user_id: string | null
          reason: string
          description: string | null
          status: string
          reviewed_by_user_id: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          reported_by_user_id?: string | null
          reason: string
          description?: string | null
          status?: string
          reviewed_by_user_id?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          reported_by_user_id?: string | null
          reason?: string
          description?: string | null
          status?: string
          reviewed_by_user_id?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      track_poll_view: {
        Args: {
          poll_uuid: string
          user_uuid?: string
          ip_addr?: string
          ua?: string
        }
        Returns: void
      }
      track_poll_share: {
        Args: {
          poll_uuid: string
          user_uuid?: string
          method: string
          platform?: string
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
