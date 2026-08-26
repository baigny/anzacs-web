create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quote text not null,
  consent boolean not null default false,
  photo_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

comment on table public.testimonials is
  'consent defaults to false. Only consent=true testimonials are ever shown publicly.';

alter table public.testimonials enable row level security;

create trigger testimonials_set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

create policy testimonials_public_select
  on public.testimonials
  for select
  using (consent = true and deleted_at is null);

create policy testimonials_admin_select
  on public.testimonials
  for select
  using (public.is_admin());

create policy testimonials_admin_insert
  on public.testimonials
  for insert
  with check (public.is_admin());

create policy testimonials_admin_update
  on public.testimonials
  for update
  using (public.is_admin())
  with check (public.is_admin());
