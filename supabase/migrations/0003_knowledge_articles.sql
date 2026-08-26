create table if not exists public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  body_markdown text not null default '',
  cover_image_url text null,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

comment on table public.knowledge_articles is
  'Knowledge base articles. No seed content exists yet; schema/admin/public template ship ahead of real content.';

create index if not exists knowledge_articles_published_idx
  on public.knowledge_articles (published) where deleted_at is null;

alter table public.knowledge_articles enable row level security;

create trigger knowledge_articles_set_updated_at
  before update on public.knowledge_articles
  for each row execute function public.set_updated_at();

create policy knowledge_public_select
  on public.knowledge_articles
  for select
  using (published = true and deleted_at is null);

create policy knowledge_admin_select
  on public.knowledge_articles
  for select
  using (public.is_admin());

create policy knowledge_admin_insert
  on public.knowledge_articles
  for insert
  with check (public.is_admin());

create policy knowledge_admin_update
  on public.knowledge_articles
  for update
  using (public.is_admin())
  with check (public.is_admin());
