-- Extensions
create extension if not exists "pgcrypto" with schema extensions;

-- admin_profiles holds the role claim for every admin user.
-- auth.users rows are created via Supabase Auth (seed / invite flow), never public signup.
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role text not null check (role in ('root_admin', 'app_admin')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

comment on table public.admin_profiles is
  'Role claim table for admin users. No public signup: rows are created via seed SQL or the root-only invite flow.';

-- Helper: current caller's admin role, or null if not an active admin.
create or replace function public.current_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.admin_profiles
  where id = auth.uid()
    and active = true
    and deleted_at is null
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_admin_role() is not null;
$$;

create or replace function public.is_root_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_admin_role() = 'root_admin';
$$;

-- Generic updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table public.admin_profiles enable row level security;

create trigger admin_profiles_set_updated_at
  before update on public.admin_profiles
  for each row execute function public.set_updated_at();

-- root_admin manages all admin accounts; app_admin can read their own row only.
create policy admin_profiles_root_all
  on public.admin_profiles
  for all
  using (public.is_root_admin())
  with check (public.is_root_admin());

create policy admin_profiles_self_select
  on public.admin_profiles
  for select
  using (id = auth.uid());
