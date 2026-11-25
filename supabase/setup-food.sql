-- ONE-TIME SETUP: paste this whole file into Supabase -> SQL Editor -> Run. Safe to run again.
-- Part 1: admin functions (updated: remembers the paid plan).

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
         -- remember which plan was paid for, so members can't switch themselves to VIP
         || jsonb_build_object('paid_plan', coalesce(raw_user_meta_data ->> 'plan', 'Strong-and-Toned'))
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
     set raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('plan', plan),
         raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('paid_plan', plan)
   where id = target;
end;
$$;

revoke all on function public.admin_list_members() from public, anon;
revoke all on function public.admin_set_membership(uuid, text, date) from public, anon;
revoke all on function public.admin_set_plan(uuid, text) from public, anon;
grant execute on function public.admin_list_members() to authenticated;
grant execute on function public.admin_set_membership(uuid, text, date) to authenticated;
grant execute on function public.admin_set_plan(uuid, text) to authenticated;

-- Part 2: food calculator tables.

-- One row per member per day with the foods they logged.
create table if not exists public.food_log (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  day date not null,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- Daily goals and the member's own saved foods.
create table if not exists public.food_settings (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  goal jsonb not null default '{}'::jsonb,
  custom jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.food_log enable row level security;
alter table public.food_settings enable row level security;

-- Members can only see and change their own rows; admins can read everyone's.
drop policy if exists "own food log" on public.food_log;
create policy "own food log" on public.food_log
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "admin reads food log" on public.food_log;
create policy "admin reads food log" on public.food_log
  for select to authenticated using (public.is_admin());

drop policy if exists "own food settings" on public.food_settings;
create policy "own food settings" on public.food_settings
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "admin reads food settings" on public.food_settings;
create policy "admin reads food settings" on public.food_settings
  for select to authenticated using (public.is_admin());

revoke all on public.food_log, public.food_settings from anon;
grant select, insert, update, delete on public.food_log, public.food_settings to authenticated;
