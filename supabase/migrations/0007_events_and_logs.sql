create table if not exists public.client_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz null
);

comment on table public.client_events is
  'Lightweight, no-PII public-site observability sink written by trackEvent(). page_view, product_card_click, enquiry_submit, filter_use, etc.';

create table if not exists public.server_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  message text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  deleted_at timestamptz null
);

comment on table public.server_logs is
  'Error log sink for edge functions / backend code paths (wrapped in try/catch).';

alter table public.client_events enable row level security;
alter table public.server_logs enable row level security;

-- Anyone (including anonymous visitors) can write an event; nobody but admins can read them back.
create policy client_events_public_insert
  on public.client_events
  for insert
  to anon, authenticated
  with check (true);

create policy client_events_admin_select
  on public.client_events
  for select
  using (public.is_admin());

-- server_logs is written by trusted server-side code (service role bypasses RLS);
-- only admins may read it back from the client.
create policy server_logs_admin_select
  on public.server_logs
  for select
  using (public.is_admin());
