-- Keep the public content predicate independent of the private admin helper.
-- Anonymous visitors cannot execute private.is_admin(), so combining both
-- branches in one policy makes even published rows fail for the anon role.
drop policy if exists blog_public_read on public.blog_posts;
create policy blog_public_read on public.blog_posts
for select to anon, authenticated
using (
  status = 'published'
  and (
    editorial_verified = true
    or (publication_mode = 'automated' and automated_reviewed_at is not null)
  )
);

drop policy if exists blog_authenticated_admin_read on public.blog_posts;
create policy blog_authenticated_admin_read on public.blog_posts
for select to authenticated
using ((select private.is_admin()));
