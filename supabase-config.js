/* ==========================================================================
   Supabase connection settings for the T2W Pipeline Asset Register.

   These two values are PUBLIC. The publishable key is designed to be shipped
   in front-end code — it grants nothing on its own. What the key can actually
   read or write is decided entirely by the Row Level Security policies on the
   table (see supabase-setup.sql).

   NEVER put a key beginning with `sb_secret_` or the `service_role` JWT in
   this file. Those bypass RLS completely and would expose the whole database
   to anyone who views the page source.
   ========================================================================== */
window.SUPABASE_CONFIG = {

  /* Project REST endpoint — Supabase dashboard → Settings → API → Project URL */
  url: 'https://eqocavuzxagirrhxkfeo.supabase.co',

  /* Publishable / anon key — safe to commit */
  key: 'sb_publishable_XRFzDiy_MdJnXKiYXRgc0A_B_uhDh9-',

  /* Table holding the register. Spaces and capitals are fine — the loader
     URL-encodes it. Change this if you rename the table. */
  table: 'Asset Register',

  /* Column that uniquely identifies a record. The loader matches this
     case-insensitively against the real column names, so 'record_key',
     'Record Key' and 'RECORD KEY' all resolve to the same column. */
  keyColumn: 'record_key',

  /* Rows per request. Supabase caps a single response at 1000 by default,
     so the loader pages through in blocks of this size. */
  pageSize: 1000,

  /* Set false to load read-only and hide the "Save to Supabase" button. */
  allowWrites: true
};
