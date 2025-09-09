-- UUID support
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table if not exists polls (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references auth.users(id) on delete cascade,
    question text not null,
    description text,
    allow_multiple_votes boolean default false,
    expires_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Index for fast user-based queries
create index if not exists idx_polls_user_id on polls(user_id);


-- Votes table
create table if not exists votes (
    id uuid primary key default uuid_generate_v4(),
    poll_id uuid not null references polls(id) on delete cascade,
    option_id uuid not null references poll_options(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade, -- nullable for anonymous
    vote_token text, -- used for anonymous vote tracking (store hashed IP/session)
    created_at timestamp with time zone default now(),
    -- enforce uniqueness:
    -- if user_id exists, unique per user_id per poll
    -- if anonymous, unique per vote_token per poll
    constraint unique_vote_per_poll check (
        (user_id is not null and vote_token is null)
        or (user_id is null and vote_token is not null)
    )
);

-- Partial indexes to enforce uniqueness for each scenario
create unique index if not exists unique_vote_user on votes(poll_id, user_id) where user_id is not null;
create unique index if not exists unique_vote_token on votes(poll_id, vote_token) where vote_token is not null;

-- Row level security
-- Enable RLS
alter table polls enable row level security;
alter table votes enable row level security;

