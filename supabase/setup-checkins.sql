-- Weekly check-in (with progress photo + question for Dalila) and daily habits.
-- Run once in Supabase -> SQL Editor (after admin.sql). Safe to run again.

-- 1) Weekly check-ins
create table if not exists public.checkins (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  week_start date not null,
  weight numeric, waist numeric,
  energy smallint, sleep smallint, hunger smallint,
  note text, question text, photo text,
  reply text, replied_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, week_start)
);
alter table public.checkins enable row level security;

drop policy if exists "member reads own checkins" on public.checkins;
create policy "member reads own checkins" on public.checkins for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
drop policy if exists "member adds own checkin" on public.checkins;
create policy "member adds own checkin" on public.checkins for insert to authenticated
  with check (user_id = auth.uid() and reply is null);
drop policy if exists "admin replies" on public.checkins;
create policy "admin replies" on public.checkins for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- 2) Daily habits (one row per member per day)
create table if not exists public.habits (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  day date not null,
  done jsonb not null default '[]'::jsonb,
  primary key (user_id, day)
);
alter table public.habits enable row level security;
drop policy if exists "own habits" on public.habits;
create policy "own habits" on public.habits for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "admin reads habits" on public.habits;
create policy "admin reads habits" on public.habits for select to authenticated using (public.is_admin());

revoke all on public.checkins, public.habits from anon;
grant select, insert, update on public.checkins to authenticated;
grant select, insert, update, delete on public.habits to authenticated;

-- 3) Private storage for progress photos (max 5 MB, images only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('progress', 'progress', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "upload own progress photos" on storage.objects;
create policy "upload own progress photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'progress' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "see own progress photos" on storage.objects;
create policy "see own progress photos" on storage.objects for select to authenticated
  using (bucket_id = 'progress' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
