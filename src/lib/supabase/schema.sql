-- Elimina tutte le policy e tabelle esistenti
drop policy if exists "Enable all operations for all users" on public.levels;
drop policy if exists "Enable all operations for all users" on public.companies;
drop policy if exists "Enable all operations for all users" on public.users;
drop policy if exists "Enable all operations for all users" on public.clusters;
drop policy if exists "Enable all operations for all users" on public.teams;
drop policy if exists "Enable all operations for all users" on public.team_clusters;
drop policy if exists "Enable all operations for all users" on public.user_teams;
drop policy if exists "Enable all operations for all users" on public.processes;
drop policy if exists "Enable all operations for all users" on public.user_processes;
drop policy if exists "Enable all operations for all users" on public.questions;
drop policy if exists "Enable all operations for all users" on public.question_tags;
drop policy if exists "Enable all operations for all users" on public.rules;
drop policy if exists "Enable all operations for all users" on public.sessions;
drop policy if exists "Enable all operations for all users" on public.user_sessions;
drop policy if exists "Enable all operations for all users" on public.feedbacks;

-- Drop delle tabelle in ordine corretto per rispettare le foreign key
drop table if exists public.feedbacks;
drop table if exists public.user_sessions;
drop table if exists public.sessions;
drop table if exists public.question_tags;
drop table if exists public.user_processes;
drop table if exists public.processes;
drop table if exists public.rules;
drop table if exists public.questions;
drop table if exists public.user_teams;
drop table if exists public.team_clusters;
drop table if exists public.teams;
drop table if exists public.clusters;
drop table if exists public.users;
drop table if exists public.levels;
drop table if exists public.companies;

-- Creazione tabella companies
create table public.companies (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    name text not null
);

-- Creazione tabella levels
create table public.levels (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    company uuid references public.companies(id),
    role text not null,
    step integer not null,
    execution_weight numeric not null,
    soft_weight numeric not null,
    strategy_weight numeric not null,
    standard numeric not null
);

-- Creazione tabella users
create table public.users (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    email text not null,
    name text not null,
    surname text not null,
    company uuid references public.companies(id),
    level uuid references public.levels(id),
    mentor uuid references public.users(id),
    admin boolean default false
);

-- Creazione tabella clusters
create table public.clusters (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    name text not null,
    company uuid references public.companies(id),
    leader uuid references public.users(id),
    level integer
);

-- Creazione tabella teams
create table public.teams (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    name text not null,
    company uuid references public.companies(id),
    leader uuid references public.users(id),
    isclusterleader boolean default false,
    project boolean default false
);

-- Creazione tabella team_clusters
create table public.team_clusters (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    team_id uuid references public.teams(id),
    cluster_id uuid references public.clusters(id)
);

-- Creazione tabella user_teams
create table public.user_teams (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    user_id uuid references public.users(id),
    team_id uuid references public.teams(id)
);

-- Creazione tabella questions
create table public.questions (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    text text not null,
    type text not null,
    company uuid references public.companies(id)
);

-- Creazione tabella processes
create table public.processes (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    name text not null,
    company uuid references public.companies(id),
    linked_question_id uuid references public.questions(id)
);

-- Creazione tabella user_processes
create table public.user_processes (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    user_id uuid references public.users(id),
    process_id uuid references public.processes(id)
);

-- Creazione tabella question_tags
create table public.question_tags (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    question_id uuid references public.questions(id),
    tag text not null,
    score numeric not null,
    company uuid references public.companies(id)
);

-- Creazione tabella rules
create table public.rules (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    content_sql text not null,
    number integer not null,
    company uuid references public.companies(id)
);

-- Creazione tabella sessions
create table public.sessions (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    name text not null,
    start_time timestamptz,
    end_time timestamptz,
    status text not null,
    company uuid references public.companies(id),
    cluster_participants integer not null,
    team_participants integer not null,
    user_participants integer not null,
    feedback_generated integer not null,
    rules_applied integer[] not null
);

-- Creazione tabella user_sessions
create table public.user_sessions (
    session_id uuid references public.sessions(id),
    user_id uuid references public.users(id),
    created_at timestamptz default now(),
    level_name text,
    level_standard numeric,
    peso_execution numeric,
    peso_soft numeric,
    peso_strategy numeric,
    self_execution numeric,
    self_soft numeric,
    self_strategy numeric,
    self_overall numeric,
    val_execution numeric,
    val_soft numeric,
    val_strategy numeric,
    val_overall numeric,
    val_gap numeric,
    primary key (session_id, user_id)
);

-- Creazione tabella feedbacks
create table public.feedbacks (
    id uuid default uuid_generate_v4() primary key,
    created_at timestamptz default now(),
    session_id uuid references public.sessions(id) not null,
    company uuid references public.companies(id) not null,
    sender uuid references public.users(id),
    receiver uuid references public.users(id),
    question_id uuid references public.questions(id),
    rule_id uuid references public.rules(id),
    value numeric,
    comment text
);

-- Abilita RLS per tutte le tabelle
alter table public.companies enable row level security;
alter table public.levels enable row level security;
alter table public.users enable row level security;
alter table public.clusters enable row level security;
alter table public.teams enable row level security;
alter table public.team_clusters enable row level security;
alter table public.user_teams enable row level security;
alter table public.processes enable row level security;
alter table public.user_processes enable row level security;
alter table public.questions enable row level security;
alter table public.question_tags enable row level security;
alter table public.rules enable row level security;
alter table public.sessions enable row level security;
alter table public.user_sessions enable row level security;
alter table public.feedbacks enable row level security;

-- Policy che permette tutte le operazioni a tutti gli utenti (per test)
create policy "Enable all operations for all users" on public.companies for all using (true) with check (true);
create policy "Enable all operations for all users" on public.levels for all using (true) with check (true);
create policy "Enable all operations for all users" on public.users for all using (true) with check (true);
create policy "Enable all operations for all users" on public.clusters for all using (true) with check (true);
create policy "Enable all operations for all users" on public.teams for all using (true) with check (true);
create policy "Enable all operations for all users" on public.team_clusters for all using (true) with check (true);
create policy "Enable all operations for all users" on public.user_teams for all using (true) with check (true);
create policy "Enable all operations for all users" on public.processes for all using (true) with check (true);
create policy "Enable all operations for all users" on public.user_processes for all using (true) with check (true);
create policy "Enable all operations for all users" on public.questions for all using (true) with check (true);
create policy "Enable all operations for all users" on public.question_tags for all using (true) with check (true);
create policy "Enable all operations for all users" on public.rules for all using (true) with check (true);
create policy "Enable all operations for all users" on public.sessions for all using (true) with check (true);
create policy "Enable all operations for all users" on public.user_sessions for all using (true) with check (true);
create policy "Enable all operations for all users" on public.feedbacks for all using (true) with check (true);

-- Funzione per ricaricare la cache dello schema
create or replace function public.reload_schema_cache()
returns void
language plpgsql
security definer
as $$
begin
  -- Forza un refresh della cache dello schema
  perform pg_notify('reload_schema', '');
end;
$$; 