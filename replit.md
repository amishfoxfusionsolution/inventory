# Inventory Management System

## Overview
A React + TypeScript inventory management application built with Vite and Supabase for the backend/database.

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **Icons**: Lucide React

## Project Structure
```
src/
  components/
    auth/         - Login and registration pages
    layout/       - Header and Sidebar components
    pages/        - Main application pages (Dashboard, Inventory, etc.)
  contexts/       - React contexts for Auth and Theme
  lib/            - Supabase client configuration
supabase/
  migrations/     - Database migration files
```

## Development
- Run: `npm run dev` (port 5000)
- Build: `npm run build`
- Type check: `npm run typecheck`

## Required Environment Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous/public key

## Database
The app uses Supabase with the following tables:
- profiles, organizations, categories, suppliers, locations
- inventory_items, stock_movements, alerts

See `supabase/migrations/` for the complete schema.
