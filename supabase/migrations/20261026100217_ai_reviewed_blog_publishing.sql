alter table public.blog_posts
  add column publication_mode text not null default 'human',
  add column automated_reviewed_at timestamptz,
  add column automated_review_report jsonb not null default '{}'::jsonb;

alter table public.blog_posts
  add constraint blog_publication_mode_valid
    check (publication_mode in ('human', 'automated')),
  drop constraint blog_publication_evidence_gate,
  add constraint blog_publication_evidence_gate
    check (
      status <> 'published'
      or (
        cardinality(source_urls) >= 3
        and length(trim(methodology)) >= 30
        and length(trim(limitations)) >= 30
        and length(trim(conflicts_disclosure)) >= 10
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
        and (
          (
            publication_mode = 'human'
            and editorial_verified = true
            and automated_reviewed_at is null
            and author_slug is not null
            and length(trim(author_slug)) >= 3
            and author_proof_url is not null
            and author_proof_url ~* '^https://[^[:space:]]+$'
            and length(trim(reviewer_name)) >= 2
            and length(trim(reviewer_qualification)) >= 20
            and reviewer_proof_url is not null
            and reviewer_proof_url ~* '^https://[^[:space:]]+$'
          )
          or (
            publication_mode = 'automated'
            and editorial_verified = false
            and author_name = 'MARKOS AI Editorial Desk'
            and author_slug is null
            and author_proof_url is null
            and reviewer_name = 'MARKOS AI Editorial Agent'
            and length(trim(reviewer_qualification)) >= 20
            and reviewer_proof_url is null
            and automated_reviewed_at is not null
            and jsonb_typeof(automated_review_report) = 'object'
            and automated_review_report->>'version' = '1'
            and automated_review_report->>'decision' = 'publish'
            and automated_review_report->'checks' @> '{"source_urls_checked": true, "claims_supported": true, "risk_language_checked": true, "no_personal_byline": true}'::jsonb
          )
        )
      )
    );

drop policy if exists blog_public_read on public.blog_posts;
create policy blog_public_read on public.blog_posts
for select to anon, authenticated
using (
  (
    status = 'published'
    and (
      editorial_verified = true
      or (publication_mode = 'automated' and automated_reviewed_at is not null)
    )
  )
  or (select private.is_admin())
);

drop index if exists public.blog_posts_public_author_idx;
create index blog_posts_public_author_idx
on public.blog_posts (author_slug, published_at desc)
where status = 'published' and editorial_verified = true;

create index blog_posts_public_automated_idx
on public.blog_posts (published_at desc)
where status = 'published' and publication_mode = 'automated';

comment on column public.blog_posts.publication_mode is
  'Publication path: human attestation or separately disclosed automated review.';
comment on column public.blog_posts.automated_reviewed_at is
  'Timestamp when automated evidence and safety checks passed; not a human review.';
comment on column public.blog_posts.automated_review_report is
  'Auditable machine review summary; must never be represented as human attestation.';
