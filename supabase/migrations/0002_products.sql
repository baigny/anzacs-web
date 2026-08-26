create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  catalog_section text not null check (catalog_section in ('hybrid', 'open_pollinated')),
  crop_type text not null,
  name text not null,
  slug text not null unique,
  hero_image_url text null,
  region_tags text[] not null default '{}',
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

comment on table public.products is
  'Product catalog (seeds). hero_image_url replaces the old site''s standalone Image Gallery photos.';

create index if not exists products_active_idx on public.products (active) where deleted_at is null;
create index if not exists products_crop_type_idx on public.products (crop_type);

-- Structured, repeatable agronomy attributes per product (not a fixed 3-bullet field).
create table if not exists public.product_attributes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  label text not null,
  value text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  deleted_at timestamptz null
);

create index if not exists product_attributes_product_idx on public.product_attributes (product_id);

alter table public.products enable row level security;
alter table public.product_attributes enable row level security;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Public: only active, non-deleted products.
create policy products_public_select
  on public.products
  for select
  using (active = true and deleted_at is null);

-- Admin: full read of everything (including inactive/soft-deleted, for the admin list view).
create policy products_admin_select
  on public.products
  for select
  using (public.is_admin());

create policy products_admin_insert
  on public.products
  for insert
  with check (public.is_admin());

create policy products_admin_update
  on public.products
  for update
  using (public.is_admin())
  with check (public.is_admin());

-- Attributes follow the same public/admin split, scoped through the parent product.
create policy product_attributes_public_select
  on public.product_attributes
  for select
  using (
    deleted_at is null
    and exists (
      select 1 from public.products p
      where p.id = product_attributes.product_id
        and p.active = true
        and p.deleted_at is null
    )
  );

create policy product_attributes_admin_select
  on public.product_attributes
  for select
  using (public.is_admin());

create policy product_attributes_admin_insert
  on public.product_attributes
  for insert
  with check (public.is_admin());

create policy product_attributes_admin_update
  on public.product_attributes
  for update
  using (public.is_admin())
  with check (public.is_admin());
