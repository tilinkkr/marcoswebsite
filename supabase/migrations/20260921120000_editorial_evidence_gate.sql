alter table public.blog_posts
  add column if not exists author_slug text,
  add column if not exists author_proof_url text,
  add column if not exists reviewer_name text not null default '',
  add column if not exists reviewer_qualification text not null default '',
  add column if not exists reviewer_proof_url text,
  add column if not exists methodology text not null default '',
  add column if not exists limitations text not null default '',
  add column if not exists conflicts_disclosure text not null default '',
  add column if not exists source_urls text[] not null default '{}',
  add column if not exists editorial_verified boolean not null default false;

-- Existing published rows predate the evidence model. They return to review
-- rather than being presented as verified without an auditable record.
update public.blog_posts
set
  status = 'review',
  published_at = null,
  editorial_verified = false
where status = 'published'
  and (
    editorial_verified = false
    or author_slug is null
    or author_proof_url is null
    or reviewer_proof_url is null
    or cardinality(source_urls) < 3
  );

alter table public.blog_posts
  add constraint blog_author_slug_format
  check (author_slug is null or author_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  add constraint blog_publication_evidence_gate
  check (
    status <> 'published'
    or (
      editorial_verified = true
      and author_slug is not null
      and length(trim(author_slug)) >= 3
      and author_proof_url ~* '^https://[^[:space:]]+$'
      and length(trim(reviewer_name)) >= 2
      and length(trim(reviewer_qualification)) >= 20
      and reviewer_proof_url ~* '^https://[^[:space:]]+$'
      and length(trim(methodology)) >= 30
      and length(trim(limitations)) >= 30
      and length(trim(conflicts_disclosure)) >= 10
      and cardinality(source_urls) >= 3
      and last_reviewed_at is not null
      and position('[verify]' in lower(
        title || excerpt || content_markdown || seo_title || seo_description ||
        methodology || limitations || conflicts_disclosure
      )) = 0
      and position('[author proof required]' in lower(
        title || excerpt || content_markdown || seo_title || seo_description ||
        methodology || limitations || conflicts_disclosure
      )) = 0
      and position('[source required]' in lower(
        title || excerpt || content_markdown || seo_title || seo_description ||
        methodology || limitations || conflicts_disclosure
      )) = 0
      and position('[insert topic]' in lower(
        title || excerpt || content_markdown || seo_title || seo_description ||
        methodology || limitations || conflicts_disclosure
      )) = 0
    )
  );

drop policy if exists blog_public_read on public.blog_posts;
create policy blog_public_read on public.blog_posts
for select to anon, authenticated
using (
  (status = 'published' and editorial_verified = true)
  or (select private.is_admin())
);

create index if not exists blog_posts_public_author_idx
on public.blog_posts (author_slug, published_at desc)
where status = 'published' and editorial_verified = true;

comment on column public.blog_posts.author_proof_url is
  'Public evidence reviewed to support the named author selection.';
comment on column public.blog_posts.reviewer_proof_url is
  'Public evidence reviewed to support the named reviewer qualification.';
comment on column public.blog_posts.editorial_verified is
  'Human attestation for the exact published version; never set by automation alone.';
