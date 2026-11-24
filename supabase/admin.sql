-- Admin access for Dalila's site.
-- Run this once in Supabase → SQL Editor. Safe to run again.

-- Who is an admin: accounts whose server-side app_metadata has role = "admin".
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- List every account (admins only).
create or replace function public.admin_list_members()
returns table (
  id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  user_meta jsonb,
  app_meta jsonb
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  return query
    select u.id, u.email::text, u.created_at, u.last_sign_in_at,
           coalesce(u.raw_user_meta_data, '{}'::jsonb), coalesce(u.raw_app_meta_data, '{}'::jsonb)
    from auth.users u
    order by u.created_at desc;
end;
$$;

-- Activate or deactivate a membership (admins only).
create or replace function public.admin_set_membership(target uuid, status text, start_date date default current_date)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if status not in ('active', 'inactive') then
    raise exception 'invalid status';
  end if;
  update auth.users
     set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
         || jsonb_build_object('membership', status, 'activated_at', start_date::text)
   where id = target;
end;
$$;

-- Change a member's plan (admins only).
create or replace function public.admin_set_plan(target uuid, plan text)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if plan not in ('Strong-and-Toned', 'VIP-1-1') then
    raise exception 'invalid plan';
  end if;
  update auth.users
     set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('plan', plan)
   where id = target;
end;
$$;

revoke all on function public.admin_list_members() from public, anon;
revoke all on function public.admin_set_membership(uuid, text, date) from public, anon;
revoke all on function public.admin_set_plan(uuid, text) from public, anon;
grant execute on function public.admin_list_members() to authenticated;
grant execute on function public.admin_set_membership(uuid, text, date) to authenticated;
grant execute on function public.admin_set_plan(uuid, text) to authenticated;
