create table public.rate_limit_buckets (
  key text primary key,
  window_started_at timestamptz not null default now(),
  request_count integer not null default 0 check (request_count >= 0),
  constraint rate_limit_key_length check (length(key) between 1 and 300)
);

alter table public.rate_limit_buckets enable row level security;
revoke all on table public.rate_limit_buckets from anon, authenticated;

create or replace function public.consume_rate_limit(
  p_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table (allowed boolean, reset_at timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  bucket public.rate_limit_buckets%rowtype;
  current_time constant timestamptz := clock_timestamp();
begin
  if length(p_key) not between 1 and 300
    or p_limit not between 1 and 10000
    or p_window_seconds not between 1 and 86400 then
    raise exception 'Invalid rate limit parameters';
  end if;

  insert into public.rate_limit_buckets as buckets (
    key,
    window_started_at,
    request_count
  ) values (
    p_key,
    current_time,
    1
  )
  on conflict (key) do update
  set
    window_started_at = case
      when buckets.window_started_at + make_interval(secs => p_window_seconds) <= current_time
        then current_time
      else buckets.window_started_at
    end,
    request_count = case
      when buckets.window_started_at + make_interval(secs => p_window_seconds) <= current_time
        then 1
      else buckets.request_count + 1
    end
  returning * into bucket;

  return query select
    bucket.request_count <= p_limit,
    bucket.window_started_at + make_interval(secs => p_window_seconds);
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
