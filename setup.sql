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

-- Extended profile columns (college/year/dept for students, org/role for professionals)
alter table public.student_registrations add column if not exists institution text;
alter table public.student_registrations add column if not exists year_info text;
alter table public.student_registrations add column if not exists department text;
alter table public.professional_registrations add column if not exists institution text;
alter table public.professional_registrations add column if not exists year_info text;
alter table public.professional_registrations add column if not exists department text;

-- Payment records (Razorpay phase): one row per completed payment attempt
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  team_name text not null,
  amount int not null,
  currency text not null default 'INR',
  razorpay_order_id text,
  razorpay_payment_id text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.payments enable row level security;

drop policy if exists payments_insert_anon on public.payments;
create policy payments_insert_anon on public.payments
  for insert with check (true);
