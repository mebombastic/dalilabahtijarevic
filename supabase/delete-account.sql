-- Lets a member delete their own account from "My account".
-- Run once in Supabase -> SQL Editor. Safe to run again.
-- Their food log and settings are removed automatically (on delete cascade).
create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  if public.is_admin() then
    raise exception 'admin account cannot be deleted here';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
