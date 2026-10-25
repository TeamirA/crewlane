-- Supabase-only: authorizes private Realtime channels.
-- Topics: "project:<projectId>" for board events, "user:<userId>" for notifications.
-- Apply with: npm run db:realtime-policies

create schema if not exists private;

-- Runs as the function owner so the membership lookup is not blocked by table RLS.
create or replace function private.is_project_member(target_project_id text, target_user_id text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public."ProjectMember" member
    where member."projectId" = target_project_id
      and member."userId" = target_user_id
  );
$$;

revoke all on function private.is_project_member(text, text) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_project_member(text, text) to authenticated;

drop policy if exists "Members receive project broadcasts" on realtime.messages;
create policy "Members receive project broadcasts"
on realtime.messages
for select
to authenticated
using (
  realtime.messages.extension = 'broadcast'
  and split_part((select realtime.topic()), ':', 1) = 'project'
  and private.is_project_member(
    split_part((select realtime.topic()), ':', 2),
    (select auth.jwt() ->> 'sub')
  )
);

drop policy if exists "Users receive their own notifications" on realtime.messages;
create policy "Users receive their own notifications"
on realtime.messages
for select
to authenticated
using (
  realtime.messages.extension = 'broadcast'
  and (select realtime.topic()) = 'user:' || (select auth.jwt() ->> 'sub')
);
