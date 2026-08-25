-- Migration: Add admin role + audit log
-- Run this in Supabase SQL Editor AFTER the initial migration

-- 1. Add role column to profiles
alter table public.profiles add column if not exists role text not null default 'user'
  check (role in ('user', 'content_editor', 'admin', 'superadmin'));

-- 2. Create admin audit log table
create table if not exists public.admin_audit_log (
  id uuid primary key default uuid_generate_v4(),
  admin_id uuid references auth.users not null,
  admin_email text not null,
  admin_name text not null,
  action text not null,
  target text not null,
  target_id text not null default '',
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz not null default now()
);

-- 3. Enable RLS on audit log (only service_role can write, no direct user access)
alter table public.admin_audit_log enable row level security;

-- No user policies = no user can read/write audit log directly
-- Only server-side (service_role) or SECURITY DEFINER functions can access it

-- 4. Create SECURITY DEFINER function to write audit logs (safe from client)
create or replace function public.log_admin_audit(
  p_admin_id uuid,
  p_admin_email text,
  p_admin_name text,
  p_action text,
  p_target text,
  p_target_id text default '',
  p_before jsonb default null,
  p_after jsonb default null
)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.admin_audit_log (admin_id, admin_email, admin_name, action, target, target_id, before_data, after_data)
  values (p_admin_id, p_admin_email, p_admin_name, p_action, p_target, p_target_id, p_before, p_after);
end;
$$;

-- 5. Create function to check if user is admin (used by middleware)
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = uid and role in ('admin', 'superadmin')
  );
$$;

-- 6. Create function to get user role (used by middleware)
create or replace function public.get_user_role(uid uuid)
returns text
language sql
security definer set search_path = ''
as $$
  select coalesce(
    (select role from public.profiles where id = uid),
    'user'
  );
$$;

-- 7. Grant execute on functions to authenticated users
grant execute on function public.is_admin(uuid) to authenticated;
grant execute on function public.get_user_role(uuid) to authenticated;
grant execute on function public.log_admin_audit(uuid, text, text, text, text, text, jsonb, jsonb) to authenticated;
