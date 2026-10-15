create extension if not exists pgcrypto;

create table if not exists public.student_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  mobile text not null,
  team_name text not null,
  team_size int not null check (team_size between 2 and 4),
  members jsonb not null default '[]'::jsonb,
  pay_method text,
  created_at timestamptz not null default now()
);

create table if not exists public.professional_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  mobile text not null,
  team_name text not null,
  team_size int not null check (team_size between 2 and 4),
  members jsonb not null default '[]'::jsonb,
  pay_method text,
  created_at timestamptz not null default now()
);

alter table public.student_registrations enable row level security;
alter table public.professional_registrations enable row level security;

drop policy if exists student_insert_anon on public.student_registrations;
create policy student_insert_anon on public.student_registrations
  for insert with check (true);

drop policy if exists professional_insert_anon on public.professional_registrations;
create policy professional_insert_anon on public.professional_registrations
  for insert with check (true);
