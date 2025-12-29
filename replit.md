# InventoryPro - Inventory Management System

## Overview
A modern React + TypeScript inventory management application with a striking diagonal black/white UI design. Built with Vite and Supabase for the backend/database.

## Features
✅ **Authentication**: User signup/login with Supabase  
✅ **Dashboard**: Inventory metrics, stock movements, alerts  
✅ **Inventory Management**: Full CRUD operations on inventory items  
✅ **Stock Tracking**: Monitor quantities, locations, suppliers  
✅ **Alerts System**: Low stock and expiry alerts  
✅ **Multi-organization**: Support for multiple organizations  
✅ **Role-based Access**: Admin, Manager, Viewer roles  
✅ **Diagonal UI**: 45-degree white (top/left) to black (bottom/right) split  

## Tech Stack
- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **Icons**: Lucide React
- **Design**: Diagonal gradient background with white/black split

## Project Structure
```
src/
  components/
    auth/         - Login and registration pages
    layout/       - Header and Sidebar navigation
    pages/        - Dashboard, Inventory, Categories, Suppliers, etc.
  contexts/       - Auth and Theme providers
  lib/            - Supabase client configuration
supabase/
  migrations/     - Database schema and sample data
```

## UI Design
- **Diagonal Split**: 45-degree gradient from white (top-left) to black (bottom-right)
- **Applied to**: Login, Register, and Dashboard pages
- **Color Scheme**: Clean white cards on gradient background

## Development
- Run: `npm run dev` (port 5000, 0.0.0.0)
- Build: `npm run build`
- Type check: `npm run typecheck`

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase public key

## Database Schema
Tables included:
- **Core**: profiles, organizations
- **Inventory**: inventory_items, categories, suppliers, locations
- **Operations**: stock_movements, purchase_orders, alerts
- **Audit**: audit_logs

## Getting Started
1. Sign up with any valid email
2. Auto-assigned to Demo Company with Admin role
3. Access dashboard with sample inventory data
4. Manage inventory items with full CRUD support

## Deployment
- **Type**: Static site (Vite build)
- **Build command**: `npm run build`
- **Output**: dist/ folder
- **Ready to publish on Replit**
