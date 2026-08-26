-- ==========================================================================
-- T2W Pipeline Asset Register — Supabase access policies
--
-- Run this in the Supabase dashboard: SQL Editor → New query → paste → Run.
--
-- Why you need it: your table currently shows
--     "This table can be accessed via the Data API but no RLS policies
--      exist so no data will be returned"
-- Row Level Security is on, and with no policies the default is deny. The API
-- answers with an empty list rather than an error, which is why the page looks
-- like it loaded but shows nothing.
--
-- IMPORTANT — read before running:
-- These policies make the register readable AND writable by anyone who has the
-- publishable key, which means anyone who can open the page. That is fine for
-- an internal tool on a private URL. It is NOT fine for a public site.
-- See "Locking it down" at the bottom for the authenticated-only version.
-- ==========================================================================


-- ---------- 1. Read access ------------------------------------------------
drop policy if exists "register readable" on public."Asset Register";

create policy "register readable"
  on public."Asset Register"
  for select
  to anon, authenticated
  using (true);


-- ---------- 2. Write access (needed for "Save to Supabase") ---------------
drop policy if exists "register updatable" on public."Asset Register";

create policy "register updatable"
  on public."Asset Register"
  for update
  to anon, authenticated
  using (true)
  with check (true);


-- ---------- 3. Insert access (only if you use "+ Add asset") --------------
drop policy if exists "register insertable" on public."Asset Register";

create policy "register insertable"
  on public."Asset Register"
  for insert
  to anon, authenticated
  with check (true);


-- ---------- 4. Confirm RLS is on and the policies took --------------------
select schemaname, tablename, policyname, cmd, roles
from   pg_policies
where  tablename = 'Asset Register';


-- ---------- 5. Speed up the lookups the page does most --------------------
-- Adjust the column name if your key column is titled differently.
create index if not exists asset_register_record_key_idx
  on public."Asset Register" ("record_key");


-- ==========================================================================
-- Locking it down (recommended once it works)
--
-- Replace `to anon, authenticated` with `to authenticated` on each policy
-- above, then add Supabase Auth to the page so users sign in before the
-- register loads. Anonymous visitors then get nothing, signed-in staff get
-- everything.
--
-- A middle ground: keep read open to anon but restrict writes:
--
--   drop policy if exists "register updatable" on public."Asset Register";
--   create policy "register updatable"
--     on public."Asset Register"
--     for update
--     to authenticated
--     using (true) with check (true);
-- ==========================================================================
