# InventoryPro

A straightforward inventory management app built with React and TypeScript. Tracks stock, suppliers, and warehouse locations with a clean interface.

## What's in here

**Frontend**: React 18 + Vite for fast dev server and optimized builds.  
**Database**: Supabase handles auth and data storage.  
**Styling**: Tailwind CSS, custom diagonal background design.

## Project layout

```
src/
  components/auth/      - login and signup forms
  components/pages/     - main app pages
  components/layout/    - sidebar and header
  contexts/             - auth state management
  lib/                  - supabase client setup
supabase/migrations/    - schema and sample data
```

## Running locally

```bash
npm run dev          # starts on port 5000
npm run build        # builds for production
npm run typecheck    # runs TypeScript check
```

## Setup

Need two env vars from Supabase:
- `VITE_SUPABASE_URL` - your project URL
- `VITE_SUPABASE_ANON_KEY` - anonymous key

Database is pre-configured with sample inventory data.

## How it works

Sign up and you're auto-assigned to a demo organization with admin access. Full CRUD on inventory items, categories, suppliers, and locations. RLS is disabled for simplicity.

Dashboard shows inventory totals, low stock alerts, and recent movements. Can filter and search items, add new ones, or edit existing records.

## UI

Diagonal split background (white top-left, black bottom-right) on auth pages. Dashboard uses a white card layout on the same background.
