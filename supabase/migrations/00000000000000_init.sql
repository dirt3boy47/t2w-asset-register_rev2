-- Example starter migration. Replace this with your real schema, or delete it and run
-- `npx supabase migration new your_table_name` to generate a fresh one.

create table if not exists public.example (
  id bigint generated always as identity primary key,
  name text not null,
  created_at timestamptz not null default now()
);

alter table public.example enable row level security;

-- Example policy: allow anyone to read. Tighten this before going to production.
create policy "Allow public read access"
  on public.example
  for select
  using (true);
