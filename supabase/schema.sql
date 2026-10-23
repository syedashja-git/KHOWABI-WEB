-- Run once in the Supabase SQL Editor for your project.
create table if not exists public.enquiries (
  id text primary key,
  name text not null,
  email text not null,
  phone text not null,
  service text not null,
  details text not null,
  company text not null default '',
  budget text not null default 'Discuss with me',
  timeline text not null default 'Flexible',
  created_at timestamptz not null default now(),
  status text not null default 'New'
);
create index if not exists enquiries_created_at_idx on public.enquiries(created_at desc);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;
grant select, insert, update, delete on public.enquiries to service_role;
-- No public policies: browsers cannot read or write customer enquiries directly.
-- Only the server-side secret key can access this table.
