-- Tascal Pet Supabase Schema

-- Hospitals
create table if not exists hospitals (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  phone text,
  address text,
  license text,
  plan text not null default 'starter' check (plan in ('starter', 'standard', 'pro')),
  trial_ends_at timestamptz,
  stripe_customer_id text,
  line_channel_token text,
  line_channel_secret text,
  created_at timestamptz default now()
);

-- Pets
create table if not exists pets (
  id uuid default gen_random_uuid() primary key,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  name text not null,
  species text not null check (species in ('dog', 'cat', 'other')),
  breed text,
  birth_date date,
  weight numeric(5,2),
  owner_name text not null,
  owner_phone text,
  owner_email text,
  allergies text,
  medical_history text,
  personality_memo text,
  is_deceased boolean default false,
  deceased_date date,
  memorial_message text,
  created_at timestamptz default now()
);

-- Appointments
create table if not exists appointments (
  id uuid default gen_random_uuid() primary key,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  pet_id uuid references pets(id) on delete cascade not null,
  title text not null,
  appointment_date date not null,
  appointment_time time not null,
  duration_minutes int default 30,
  status text not null default 'scheduled' check (status in ('scheduled', 'completed', 'cancelled')),
  notes text,
  line_notified boolean default false,
  created_at timestamptz default now()
);

-- Medical Records
create table if not exists medical_records (
  id uuid default gen_random_uuid() primary key,
  pet_id uuid references pets(id) on delete cascade not null,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  visit_date date not null,
  diagnosis text,
  treatment text,
  prescription text,
  notes text,
  vet_name text,
  created_at timestamptz default now()
);

-- Vaccines
create table if not exists vaccines (
  id uuid default gen_random_uuid() primary key,
  pet_id uuid references pets(id) on delete cascade not null,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  vaccine_name text not null,
  administered_date date not null,
  next_due_date date,
  notes text,
  created_at timestamptz default now()
);

-- Community Events
create table if not exists community_events (
  id uuid default gen_random_uuid() primary key,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  title text not null,
  description text,
  event_date date not null,
  location text,
  max_participants int,
  current_participants int default 0,
  created_at timestamptz default now()
);

-- Partners
create table if not exists partners (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text unique not null,
  partner_code text unique not null,
  commission_rate numeric(5,2) default 20,
  created_at timestamptz default now()
);

-- Partner Referrals
create table if not exists partner_referrals (
  id uuid default gen_random_uuid() primary key,
  partner_id uuid references partners(id) on delete cascade not null,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  referred_at timestamptz default now(),
  commission_amount numeric(10,2) default 0,
  status text default 'trial' check (status in ('trial', 'active', 'cancelled'))
);

-- Staff Members
create table if not exists staff_members (
  id uuid default gen_random_uuid() primary key,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  name text not null,
  email text not null,
  role text not null default '獣医師',
  created_at timestamptz default now()
);

-- Lucky Index Logs
create table if not exists lucky_index_logs (
  id uuid default gen_random_uuid() primary key,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  date date not null,
  score int not null default 0,
  breakdown jsonb default '{}',
  created_at timestamptz default now(),
  unique(hospital_id, date)
);

-- Vet Notes (気づき日誌)
create table if not exists vet_notes (
  id uuid default gen_random_uuid() primary key,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  pet_id uuid references pets(id) on delete cascade not null,
  mode text not null check (mode in ('breakthrough', 'steady', 'concern')),
  content text not null,
  created_at timestamptz default now()
);

-- Gratitude Messages (感謝の宝箱)
create table if not exists gratitude_messages (
  id uuid default gen_random_uuid() primary key,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  pet_id uuid references pets(id) on delete cascade,
  pet_name text,
  owner_name text,
  message text not null,
  created_at timestamptz default now()
);

-- Adversity Records (先生の心の記録)
create table if not exists adversity_records (
  id uuid default gen_random_uuid() primary key,
  hospital_id uuid references hospitals(id) on delete cascade not null,
  pet_id uuid references pets(id) on delete set null,
  pet_name text,
  content text not null,
  recorded_at timestamptz default now(),
  ai_reflection text,
  reflection_sent_at timestamptz
);

-- RLS Policies (enable for all tables)
alter table hospitals enable row level security;
alter table pets enable row level security;
alter table appointments enable row level security;
alter table medical_records enable row level security;
alter table vaccines enable row level security;
alter table community_events enable row level security;
alter table staff_members enable row level security;
