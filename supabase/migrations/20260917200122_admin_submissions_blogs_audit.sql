create schema if not exists private;

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint admin_users_email_normalized check (email = lower(trim(email)))
);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  parent_submission_id uuid references public.form_submissions(id) on delete set null,
  form_type text not null check (form_type in ('contact', 'team_application', 'checkout', 'payment')),
  status text not null default 'new' check (status in ('new', 'reviewing', 'approved', 'rejected', 'archived')),
  name text,
  email text,
  phone text,
  payload jsonb not null default '{}'::jsonb,
  attachment_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content_markdown text not null,
  hero_image text not null default '/images/marcos/insights/prop-firm-rules-india-2026.webp',
  author_name text not null default 'MARCOS Editorial Desk',
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  published_at timestamptz,
  seo_title text not null,
  seo_description text not null,
  canonical_url text,
  og_image text,
  featured boolean not null default false,
  category text not null default 'MARKET EDUCATION',
  tags text[] not null default '{}',
  last_reviewed_at timestamptz,
  requires_regulatory_review boolean not null default true,
  reading_time integer not null default 5 check (reading_time between 1 and 120),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  changed_fields text[] not null default '{}',
  metadata jsonb not null default '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.system_heartbeats (
  id text primary key,
  last_run_at timestamptz not null default now(),
  source text not null,
  deployment text,
  run_count bigint not null default 1,
  constraint heartbeat_id check (id = 'vercel-six-day-heartbeat')
);

create index form_submissions_created_at_idx on public.form_submissions (created_at desc);
create index form_submissions_type_status_created_idx on public.form_submissions (form_type, status, created_at desc);
create index form_submissions_email_idx on public.form_submissions (lower(email)) where email is not null;
create index blog_posts_public_idx on public.blog_posts (status, published_at desc) where status = 'published';
create index blog_posts_updated_idx on public.blog_posts (updated_at desc);
create index audit_events_created_idx on public.audit_events (created_at desc);
create index audit_events_entity_idx on public.audit_events (entity_type, entity_id, created_at desc);

create or replace function private.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select check_user_id is not null and exists (
    select 1 from public.admin_users
    where user_id = check_user_id and active = true
  );
$$;

revoke all on function private.is_admin(uuid) from public, anon;
grant execute on function private.is_admin(uuid) to authenticated;

create or replace function private.enforce_three_admin_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.admin_users where active = true) >= 3 then
    raise exception 'MARCOS allows a maximum of three active administrators';
  end if;
  return new;
end;
$$;

create trigger admin_users_limit
before insert on public.admin_users
for each row execute function private.enforce_three_admin_limit();

revoke all on function private.enforce_three_admin_limit() from public, anon, authenticated;

create or replace function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger admin_users_touch before update on public.admin_users
for each row execute function private.touch_updated_at();
create trigger submissions_touch before update on public.form_submissions
for each row execute function private.touch_updated_at();
create trigger blog_posts_touch before update on public.blog_posts
for each row execute function private.touch_updated_at();

revoke all on function private.touch_updated_at() from public, anon, authenticated;

create or replace function private.capture_audit_event()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_id text;
  fields text[] := '{}';
begin
  row_id := coalesce(to_jsonb(new)->>'id', to_jsonb(old)->>'id', to_jsonb(new)->>'user_id', to_jsonb(old)->>'user_id');
  if tg_op = 'UPDATE' then
    select coalesce(array_agg(key order by key), '{}') into fields
    from jsonb_each(to_jsonb(new)) n
    where (to_jsonb(old)->n.key) is distinct from n.value;
  end if;

  insert into public.audit_events(actor_id, action, entity_type, entity_id, changed_fields, metadata)
  values (
    auth.uid(),
    lower(tg_op),
    tg_table_name,
    row_id,
    fields,
    jsonb_build_object('database_trigger', true)
  );
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

revoke all on function private.capture_audit_event() from public, anon, authenticated;

create trigger admin_users_audit after insert or update or delete on public.admin_users
for each row execute function private.capture_audit_event();
create trigger submissions_audit after insert or update or delete on public.form_submissions
for each row execute function private.capture_audit_event();
create trigger blog_posts_audit after insert or update or delete on public.blog_posts
for each row execute function private.capture_audit_event();

alter table public.admin_users enable row level security;
alter table public.form_submissions enable row level security;
alter table public.blog_posts enable row level security;
alter table public.audit_events enable row level security;
alter table public.system_heartbeats enable row level security;

revoke all on public.admin_users, public.form_submissions, public.audit_events, public.system_heartbeats from anon, authenticated;
revoke all on public.blog_posts from anon, authenticated;
grant select on public.blog_posts to anon, authenticated;
grant select on public.admin_users, public.form_submissions, public.audit_events, public.system_heartbeats to authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant update on public.form_submissions to authenticated;

create policy blog_public_read on public.blog_posts
for select to anon, authenticated
using (status = 'published' or (select private.is_admin()));

create policy blog_admin_insert on public.blog_posts
for insert to authenticated
with check ((select private.is_admin()));
create policy blog_admin_update on public.blog_posts
for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
create policy blog_admin_delete on public.blog_posts
for delete to authenticated
using ((select private.is_admin()));

create policy admin_users_admin_read on public.admin_users
for select to authenticated
using ((select private.is_admin()));
create policy submissions_admin_read on public.form_submissions
for select to authenticated
using ((select private.is_admin()));
create policy submissions_admin_update on public.form_submissions
for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));
create policy audit_admin_read on public.audit_events
for select to authenticated
using ((select private.is_admin()));
create policy heartbeat_admin_read on public.system_heartbeats
for select to authenticated
using ((select private.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('team-resumes', 'team-resumes', false, 5242880, array['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('payment-receipts', 'payment-receipts', false, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
