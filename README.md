# T2W Asset Register — Supabase front end

The register reads its data from your Supabase table instead of `data.json`, and
writes edits straight back — no workbook required.

## Before anything else — rotate your secret key

You pasted a key beginning `sb_secret_`. That key bypasses Row Level Security
entirely; anyone holding it can read, change or delete the whole database. Treat
it as compromised:

Supabase dashboard → **Settings → API keys** → revoke/rotate the secret key.

Only the **publishable** key (`sb_publishable_…`) belongs in front-end code, and
that is the one wired into `supabase-config.js`.

## Files

| File | What it does |
|---|---|
| `edit.html` | Your original page, with two script tags added before `</body>` |
| `supabase-config.js` | URL, publishable key, table name — the only file you edit |
| `supabase-data.js` | Loads the table into the page and saves edits back |
| `supabase-setup.sql` | RLS policies — **without these you get zero rows** |

## Setup

**1. Run the SQL.** Supabase dashboard → SQL Editor → New query → paste all of
`supabase-setup.sql` → Run. This is what fixes the warning on your table:

> This table can be accessed via the Data API but no RLS policies exist so no
> data will be returned

RLS is on with no policies, so the default is deny. The API answers with an
empty list rather than an error, which is why a page can look like it loaded
fine and still show nothing.

**2. Check the table name.** `supabase-config.js` is set to `Asset Register`.
If your table is named differently, change it there — spaces and capitals are
fine, the loader URL-encodes it.

**3. Serve the files over http.** All four files go in the same folder. A page
opened by double-clicking runs on `file://`, where browsers block the fetches
this needs. Locally:

```
npx serve .
```

Then open the address it prints. On GitHub Pages, Cloudflare Pages, Netlify or
any static host it just works.

## How it fits the existing page

Nothing was rewritten — only added. `supabase-data.js` replaces the page's
`window.LOAD_DATA` hook and leaves everything else alone:

- **Loading** pages through the table 1000 rows at a time (Supabase caps a
  single response at 1000), then reshapes the result into the `{cols, rows}`
  structure `setData()` already expects.
- **Column names** are normalised through the page's own `snakeHeader()`, so
  `Record Key` in Supabase resolves to `record_key` in the page and the filters,
  search and chainage inputs keep working untouched.
- **Dates** are converted between Supabase ISO dates and the Excel serial
  numbers the page holds internally, so the date pickers behave as before.
- **Numbers** are coerced for the columns the page treats as numeric — if those
  columns are stored as `text` in Supabase, the chainage range filter would
  otherwise compare strings and silently return wrong results.
- **Editing** no longer needs a workbook. The page gates editing on `canEdit()`,
  which normally asks whether workbook bytes are loaded. That is replaced before
  the first render, so the row checkboxes and the drawer's input fields are
  present from the start instead of appearing only once a file is opened.
- **Saving** adds a *Save to Supabase* button next to the Excel one. Changed
  records are PATCHed one per request, matched on `record_key`; assets created
  through *+ Add asset* are POSTed as new rows. The pending queue, Review dialog
  and Discard all behave as before. The queue is only cleared once every request
  has succeeded, so a partial failure leaves your changes intact to retry.

The Excel path is untouched. Open a workbook and *Save to Excel* reappears and
behaves exactly as before.

One gap to expect: the **Drawings** and **Exceptions** tabs come up empty. Those
lists were built from other sheets in the workbook, not from the asset table, so
there is nothing in Supabase to fill them yet. Everything else — search, filters,
the chainage strip, the detail drawer, bulk edit — runs off the asset rows and
works as normal. If you want those tabs back, put the two sheets in their own
Supabase tables and the loader can be extended to pull them.

## Two things worth deciding

**Anyone with the page can edit the register.** The policies in
`supabase-setup.sql` grant write access to the `anon` role, which means the
publishable key in the page source is enough. That is reasonable for an internal
tool on a private URL and wrong for anything public. The bottom of the SQL file
has the authenticated-only version to switch to once it works.

**Edits are last-write-wins.** Two people editing the same record will overwrite
each other with no warning. If more than one person will be editing, that is
worth handling before rollout.

Also worth settling early: your Cloudflare build regenerates `data.json` from the
workbook on every push, and `edit.html` no longer reads it. Any other page still
on `data.json` is now a second source of truth that will drift from Supabase.

## If it loads nothing

- **Zero rows, no error** — the RLS policies didn't apply. Re-run step 1 and
  check the `pg_policies` query at the end of the SQL returns rows.
- **HTTP 404** — table name mismatch in `supabase-config.js`.
- **HTTP 401** — wrong or rotated key.
- **A CORS or `file://` error** — you opened the page from disk. See step 3.
- **Loads but stays read-only** — check the console for the
  `Loaded N records … editing enabled` line. If it says *disabled by config*,
  set `allowWrites: true` in `supabase-config.js`.

The browser console carries the full error in every case.
