-- SQL schema for Supabase PostgreSQL

create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  first_name text,
  last_name text,
  phone text not null unique
);

create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  name text not null,
  message text
);

create table if not exists coupon_codes (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default now(),
  code text not null unique,
  redeemed boolean default false,
  contact_id uuid references contacts(id),
  campaign_id uuid references campaigns(id)
);
