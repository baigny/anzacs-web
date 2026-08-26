create table if not exists public.site_copy (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

comment on table public.site_copy is
  'Key/value editable text blocks. Public pages read these live instead of hardcoding copy.';

alter table public.site_copy enable row level security;

create trigger site_copy_set_updated_at
  before update on public.site_copy
  for each row execute function public.set_updated_at();

create policy site_copy_public_select
  on public.site_copy
  for select
  using (deleted_at is null);

create policy site_copy_admin_insert
  on public.site_copy
  for insert
  with check (public.is_admin());

create policy site_copy_admin_update
  on public.site_copy
  for update
  using (public.is_admin())
  with check (public.is_admin());
