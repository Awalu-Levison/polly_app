# Database Schema Documentation

This document describes the complete database schema for the Polling App, built with Supabase (PostgreSQL).

## Overview

The database is designed to support a comprehensive polling application with features including:
- User authentication and profiles
- Poll creation and management
- Voting system (both authenticated and anonymous)
- Poll sharing and analytics
- Categories and tags
- Comments and moderation
- QR code generation for easy sharing

## Tables

### Core Tables

#### `polls`
The main table storing poll information.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to auth.users |
| `title` | TEXT | Optional poll title |
| `question` | TEXT | The poll question (required) |
| `description` | TEXT | Optional poll description |
| `allow_multiple_votes` | BOOLEAN | Whether users can vote multiple times |
| `allow_anonymous` | BOOLEAN | Whether anonymous voting is allowed |
| `max_votes_per_user` | INTEGER | Maximum votes per user (default: 1) |
| `is_public` | BOOLEAN | Whether poll is publicly visible |
| `is_active` | BOOLEAN | Whether poll is currently active |
| `expires_at` | TIMESTAMP | Optional expiration date |
| `vote_count` | INTEGER | Total vote count (computed) |
| `view_count` | INTEGER | Total view count |
| `share_token` | TEXT | Unique token for sharing |
| `category_id` | UUID | Foreign key to poll_categories |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### `poll_options`
Stores the available options for each poll.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `poll_id` | UUID | Foreign key to polls |
| `option_text` | TEXT | The option text |
| `created_at` | TIMESTAMP | Creation timestamp |

#### `votes`
Stores individual votes cast on poll options.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `poll_id` | UUID | Foreign key to polls |
| `option_id` | UUID | Foreign key to poll_options |
| `user_id` | UUID | Foreign key to auth.users (nullable for anonymous) |
| `vote_token` | TEXT | Token for anonymous voting |
| `ip_address` | INET | Voter's IP address |
| `user_agent` | TEXT | Voter's user agent |
| `session_id` | TEXT | Session identifier |
| `created_at` | TIMESTAMP | Vote timestamp |

### Categorization Tables

#### `poll_categories`
Predefined categories for organizing polls.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Category name (unique) |
| `description` | TEXT | Category description |
| `color` | TEXT | Hex color code for UI |
| `created_at` | TIMESTAMP | Creation timestamp |

#### `poll_tags`
Flexible tagging system for polls.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `name` | TEXT | Tag name (unique) |
| `color` | TEXT | Hex color code for UI |
| `created_at` | TIMESTAMP | Creation timestamp |

#### `poll_tag_assignments`
Many-to-many relationship between polls and tags.

| Column | Type | Description |
|--------|------|-------------|
| `poll_id` | UUID | Foreign key to polls |
| `tag_id` | UUID | Foreign key to poll_tags |

### Analytics Tables

#### `poll_analytics`
Tracks various events for analytics.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `poll_id` | UUID | Foreign key to polls |
| `event_type` | TEXT | Type of event ('view', 'vote', 'share', 'qr_scan') |
| `user_id` | UUID | Foreign key to auth.users (nullable) |
| `ip_address` | INET | User's IP address |
| `user_agent` | TEXT | User's user agent |
| `referrer` | TEXT | Referrer URL |
| `created_at` | TIMESTAMP | Event timestamp |

#### `poll_shares`
Tracks sharing activities.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `poll_id` | UUID | Foreign key to polls |
| `shared_by_user_id` | UUID | Foreign key to auth.users (nullable) |
| `share_method` | TEXT | Method used ('link', 'qr', 'social', 'embed') |
| `platform` | TEXT | Platform used for sharing |
| `created_at` | TIMESTAMP | Share timestamp |

#### `poll_participants`
Tracks poll participation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `poll_id` | UUID | Foreign key to polls |
| `user_id` | UUID | Foreign key to auth.users (nullable) |
| `participant_token` | TEXT | Token for anonymous participants |
| `first_participated_at` | TIMESTAMP | First participation |
| `last_participated_at` | TIMESTAMP | Last participation |
| `vote_count` | INTEGER | Number of votes cast |

### Social Features

#### `poll_comments`
User comments on polls.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `poll_id` | UUID | Foreign key to polls |
| `user_id` | UUID | Foreign key to auth.users (nullable) |
| `comment_text` | TEXT | Comment content |
| `is_approved` | BOOLEAN | Moderation status |
| `created_at` | TIMESTAMP | Comment timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

#### `poll_reports`
Reports for content moderation.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `poll_id` | UUID | Foreign key to polls |
| `reported_by_user_id` | UUID | Foreign key to auth.users (nullable) |
| `reason` | TEXT | Report reason |
| `description` | TEXT | Additional details |
| `status` | TEXT | Report status ('pending', 'reviewed', 'resolved', 'dismissed') |
| `reviewed_by_user_id` | UUID | Foreign key to auth.users (nullable) |
| `reviewed_at` | TIMESTAMP | Review timestamp |
| `created_at` | TIMESTAMP | Report timestamp |

### User Management

#### `profiles`
Extended user profiles (extends auth.users).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (matches auth.users.id) |
| `name` | TEXT | User's display name |
| `email` | TEXT | User's email |
| `created_at` | TIMESTAMP | Profile creation |
| `updated_at` | TIMESTAMP | Last update |

## Indexes

The schema includes several indexes for optimal performance:

- `idx_polls_user_id` - Fast user-based poll queries
- `idx_polls_share_token` - Fast poll lookup by share token
- `idx_polls_is_public` - Filter public polls
- `idx_polls_is_active` - Filter active polls
- `idx_polls_category_id` - Filter by category
- `idx_polls_created_at` - Sort by creation date
- `idx_poll_options_poll_id` - Fast option lookups
- `idx_votes_poll_id` - Fast vote queries
- `idx_votes_option_id` - Fast option vote counts
- `idx_poll_analytics_poll_id` - Analytics queries
- `idx_poll_participants_poll_id` - Participant queries

## Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

### Polls
- Anyone can view public polls
- Users can only modify their own polls

### Poll Options
- Anyone can view options
- Only poll owners can add/modify options

### Votes
- Anyone can view votes
- Authenticated users can vote
- Anonymous voting allowed with vote tokens

### Analytics
- Poll owners can view their analytics
- Anyone can insert analytics events

### Comments
- Anyone can view approved comments
- Poll owners can view all comments
- Authenticated users can add comments

## Functions

### `update_poll_vote_count()`
Automatically updates vote counts when votes are added/removed.

### `track_poll_view(poll_uuid, user_uuid, ip_addr, ua)`
Tracks poll views and updates view count.

### `track_poll_share(poll_uuid, user_uuid, method, platform)`
Tracks poll sharing activities.

## Triggers

### `update_poll_vote_count_trigger`
Automatically updates poll vote counts and participant records when votes are added/removed.

### `update_polls_updated_at`
Updates the `updated_at` timestamp when polls are modified.

## Constraints

### Unique Constraints
- `unique_vote_per_poll` - Ensures one vote per user per poll (or per vote token for anonymous)
- `unique_participant_per_poll` - Ensures unique participants per poll
- `unique_vote_user` - Unique vote per authenticated user per poll
- `unique_vote_token` - Unique vote per anonymous token per poll

### Check Constraints
- Vote constraints ensure either user_id or vote_token is provided, not both
- Participant constraints ensure either user_id or participant_token is provided, not both

## Default Data

The schema includes default categories and tags:

### Categories
- General, Politics, Entertainment, Sports, Technology, Food, Travel, Education

### Tags
- trending, popular, quick, serious, fun, controversial, local, global

## Usage Examples

### Creating a Poll
```sql
INSERT INTO polls (user_id, question, title, allow_anonymous, is_public)
VALUES ('user-uuid', 'What is your favorite color?', 'Color Poll', true, true);
```

### Adding Options
```sql
INSERT INTO poll_options (poll_id, option_text)
VALUES 
  ('poll-uuid', 'Red'),
  ('poll-uuid', 'Blue'),
  ('poll-uuid', 'Green');
```

### Casting a Vote
```sql
INSERT INTO votes (poll_id, option_id, user_id)
VALUES ('poll-uuid', 'option-uuid', 'user-uuid');
```

### Tracking a View
```sql
SELECT track_poll_view('poll-uuid', 'user-uuid', '192.168.1.1', 'Mozilla/5.0...');
```

## Migration Files

- `0001_create_polls.sql` - Initial schema with basic poll functionality
- `0002_complete_polling_schema.sql` - Extended schema with analytics, categories, and social features

## Environment Variables

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
