
create table if not exists poll_options (
    id uuid primary key default uuid_generate_v4(),
    poll_id uuid not null references polls(id) on delete cascade,
    option_text text not null,
    created_at timestamp with time zone default now()
);

alter table poll_options enable row level security;
