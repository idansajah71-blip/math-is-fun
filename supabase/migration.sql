-- Migration: Create profiles table
-- Run this in Supabase SQL Editor (https://app.supabase.com > SQL Editor)

-- 1. Enable UUID extension (if not already)
create extension if not exists "uuid-ossp";

-- 2. Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null default 'Pelajar',
  xp integer not null default 0,
  gems integer not null default 0,
  hearts integer not null default 5,
  max_hearts integer not null default 5,
  streak integer not null default 0,
  last_active date not null default current_date,
  level integer not null default 0,
  badges text[] not null default '{}',
  completed_topics text[] not null default '{}',
  bookmarked_topics text[] not null default '{}',
  quiz_scores jsonb not null default '{}',
  wrong_answers jsonb not null default '{}',
  streak_freeze integer not null default 0,
  purchased_items text[] not null default '{}',
  total_study_time integer not null default 0,
  weekly_xp integer[] not null default '{0,0,0,0,0,0,0}',
  weekly_accuracy integer[] not null default '{0,0,0,0,0,0,0}',
  daily_reward_claimed date,
  daily_reward_streak integer not null default 0,
  double_xp_next_lesson boolean not null default false,
  last_seen_level integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. Enable Row Level Security
alter table public.profiles enable row level security;

-- 4. Policies: users can only read/write their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 5. Auto-create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', 'Pelajar')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Updated_at trigger
create or replace function public.update_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();

-- 7. Leaderboard view (top users by weekly XP)
-- SECURITY DEFINER: view runs as owner, bypassing RLS so all users can see the leaderboard
create or replace view public.leaderboard_weekly with (security_invoker = false) as
select
  id,
  name,
  level,
  xp,
  streak,
  weekly_xp,
  -- Sum of this week's XP
  (select sum(x) from unnest(weekly_xp) x) as weekly_xp_total
from public.profiles
order by (select sum(x) from unnest(weekly_xp) x) desc;

-- 8. All-time leaderboard view
create or replace view public.leaderboard_alltime with (security_invoker = false) as
select
  id,
  name,
  level,
  xp,
  streak,
  badges
from public.profiles
order by xp desc;
