# Supabase + GitHub Starter

This folder holds your Supabase project's schema (migrations) as code, so it can live in GitHub
and deploy automatically instead of being edited only through the Supabase dashboard.

## What's in here

```
supabase/
  config.toml              # local Supabase CLI config
  migrations/
    00000000000000_init.sql  # example migration — replace with your schema
  seed.sql                  # optional sample/seed data
.github/
  workflows/
    supabase-deploy.yml     # pushes migrations to Supabase on every push to main
.gitignore
```

## How to use this

1. **Drag this whole folder's contents** into the root of your existing GitHub repo folder
   on your computer (merge with what's already there — don't overwrite your own code).

2. **Commit and push:**
   ```
   git add .
   git commit -m "Add Supabase config and migrations"
   git push
   ```

3. **Link your local project to your actual Supabase project** (one-time, needs the
   [Supabase CLI](https://supabase.com/docs/guides/cli) installed):
   ```
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   ```
   Your project ref is in the Supabase dashboard URL: `app.supabase.com/project/<this-part>`.

4. **Add GitHub secrets** so the included Action can deploy for you. In your GitHub repo:
   Settings → Secrets and variables → Actions → New repository secret. Add:
   - `SUPABASE_ACCESS_TOKEN` — generate at https://app.supabase.com/account/tokens
   - `SUPABASE_PROJECT_ID` — your project ref from step 3
   - `SUPABASE_DB_PASSWORD` — the database password you set when creating the project

5. **Push to `main`.** The workflow in `.github/workflows/supabase-deploy.yml` will run
   `supabase db push` and apply any new migration files to your live Supabase database.

## Making schema changes going forward

Don't edit tables only in the dashboard once this is set up — create a new migration instead,
so it's tracked in git:
```
npx supabase migration new your_change_name
```
Edit the generated `.sql` file in `supabase/migrations/`, commit, and push. The Action applies it.
