create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  crop_interest text null,
  product_id uuid null references public.products (id) on delete set null,
  message text null,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

comment on table public.enquiries is
  'Public enquiry form submissions. Insert-only from the public; no public SELECT (no PII leakage). Admins can read and update status only.';

create index if not exists enquiries_status_idx on public.enquiries (status) where deleted_at is null;
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);

alter table public.enquiries enable row level security;

create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

-- Public can INSERT only (no select policy at all for anon/authenticated non-admin).
create policy enquiries_public_insert
  on public.enquiries
  for insert
  to anon, authenticated
  with check (
    consent = true
    and length(trim(name)) > 0
    and length(trim(mobile)) > 0
  );

create policy enquiries_admin_select
  on public.enquiries
  for select
  using (public.is_admin());

-- Admins may only update the status field in practice; enforced at the app layer
-- (RLS still restricts row visibility/target to admins only).
create policy enquiries_admin_update
  on public.enquiries
  for update
  using (public.is_admin())
  with check (public.is_admin());
