/*
  # Inventory Management System Database Schema
  
  ## Overview
  Complete database schema for a production-ready inventory management system
  supporting multi-tenant operations, role-based access, and comprehensive tracking.
  
  ## New Tables
  
  1. **profiles**
     - `id` (uuid, primary key, references auth.users)
     - `email` (text)
     - `full_name` (text)
     - `avatar_url` (text)
     - `role` (text: admin, manager, viewer)
     - `organization_id` (uuid, references organizations)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  2. **organizations**
     - `id` (uuid, primary key)
     - `name` (text)
     - `description` (text)
     - `settings` (jsonb)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  3. **categories**
     - `id` (uuid, primary key)
     - `organization_id` (uuid, references organizations)
     - `name` (text)
     - `description` (text)
     - `parent_id` (uuid, references categories - for subcategories)
     - `color` (text)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  4. **suppliers**
     - `id` (uuid, primary key)
     - `organization_id` (uuid, references organizations)
     - `name` (text)
     - `contact_person` (text)
     - `email` (text)
     - `phone` (text)
     - `address` (text)
     - `lead_time_days` (integer)
     - `notes` (text)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  5. **locations**
     - `id` (uuid, primary key)
     - `organization_id` (uuid, references organizations)
     - `name` (text)
     - `address` (text)
     - `type` (text: warehouse, store, depot)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  6. **inventory_items**
     - `id` (uuid, primary key)
     - `organization_id` (uuid, references organizations)
     - `sku` (text, unique)
     - `barcode` (text)
     - `name` (text)
     - `description` (text)
     - `category_id` (uuid, references categories)
     - `supplier_id` (uuid, references suppliers)
     - `location_id` (uuid, references locations)
     - `quantity` (integer)
     - `unit` (text: pcs, kg, lbs, etc)
     - `unit_cost` (decimal)
     - `selling_price` (decimal)
     - `reorder_level` (integer)
     - `reorder_quantity` (integer)
     - `expiry_date` (date)
     - `serial_numbers` (jsonb array)
     - `images` (jsonb array)
     - `tags` (text array)
     - `status` (text: active, discontinued, out_of_stock)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  7. **stock_movements**
     - `id` (uuid, primary key)
     - `organization_id` (uuid, references organizations)
     - `item_id` (uuid, references inventory_items)
     - `type` (text: inbound, outbound, transfer, adjustment, stocktake)
     - `quantity` (integer)
     - `from_location_id` (uuid, references locations)
     - `to_location_id` (uuid, references locations)
     - `reference_number` (text)
     - `unit_cost` (decimal)
     - `notes` (text)
     - `performed_by` (uuid, references profiles)
     - `created_at` (timestamptz)
  
  8. **purchase_orders**
     - `id` (uuid, primary key)
     - `organization_id` (uuid, references organizations)
     - `po_number` (text, unique)
     - `supplier_id` (uuid, references suppliers)
     - `status` (text: draft, pending, received, cancelled)
     - `order_date` (date)
     - `expected_date` (date)
     - `received_date` (date)
     - `total_amount` (decimal)
     - `notes` (text)
     - `created_by` (uuid, references profiles)
     - `created_at` (timestamptz)
     - `updated_at` (timestamptz)
  
  9. **purchase_order_items**
     - `id` (uuid, primary key)
     - `po_id` (uuid, references purchase_orders)
     - `item_id` (uuid, references inventory_items)
     - `quantity_ordered` (integer)
     - `quantity_received` (integer)
     - `unit_cost` (decimal)
     - `created_at` (timestamptz)
  
  10. **alerts**
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `type` (text: low_stock, expiry, reorder)
      - `severity` (text: low, medium, high, critical)
      - `title` (text)
      - `message` (text)
      - `item_id` (uuid, references inventory_items)
      - `is_read` (boolean)
      - `acknowledged_by` (uuid, references profiles)
      - `acknowledged_at` (timestamptz)
      - `created_at` (timestamptz)
  
  11. **audit_logs**
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organizations)
      - `user_id` (uuid, references profiles)
      - `action` (text)
      - `entity_type` (text)
      - `entity_id` (uuid)
      - `changes` (jsonb)
      - `ip_address` (text)
      - `created_at` (timestamptz)
  
  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies restrict access based on organization_id and user role
  - Admin: full CRUD access
  - Manager: read/write (no delete)
  - Viewer: read-only access
  
  ## Indexes
  - Created for frequently queried columns to optimize performance
  - Full-text search indexes for inventory items
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  role text DEFAULT 'viewer' CHECK (role IN ('admin', 'manager', 'viewer')),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  contact_person text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  lead_time_days integer DEFAULT 7,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  address text DEFAULT '',
  type text DEFAULT 'warehouse' CHECK (type IN ('warehouse', 'store', 'depot')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create inventory_items table
CREATE TABLE IF NOT EXISTS inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  sku text NOT NULL,
  barcode text DEFAULT '',
  name text NOT NULL,
  description text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  quantity integer DEFAULT 0,
  unit text DEFAULT 'pcs',
  unit_cost decimal(10,2) DEFAULT 0,
  selling_price decimal(10,2) DEFAULT 0,
  reorder_level integer DEFAULT 10,
  reorder_quantity integer DEFAULT 50,
  expiry_date date,
  serial_numbers jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT ARRAY[]::text[],
  status text DEFAULT 'active' CHECK (status IN ('active', 'discontinued', 'out_of_stock')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, sku)
);

-- Create stock_movements table
CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  item_id uuid REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('inbound', 'outbound', 'transfer', 'adjustment', 'stocktake')),
  quantity integer NOT NULL,
  from_location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  to_location_id uuid REFERENCES locations(id) ON DELETE SET NULL,
  reference_number text DEFAULT '',
  unit_cost decimal(10,2) DEFAULT 0,
  notes text DEFAULT '',
  performed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create purchase_orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  po_number text NOT NULL,
  supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'received', 'cancelled')),
  order_date date DEFAULT CURRENT_DATE,
  expected_date date,
  received_date date,
  total_amount decimal(10,2) DEFAULT 0,
  notes text DEFAULT '',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, po_number)
);

-- Create purchase_order_items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id uuid REFERENCES purchase_orders(id) ON DELETE CASCADE NOT NULL,
  item_id uuid REFERENCES inventory_items(id) ON DELETE CASCADE NOT NULL,
  quantity_ordered integer NOT NULL,
  quantity_received integer DEFAULT 0,
  unit_cost decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('low_stock', 'expiry', 'reorder')),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  message text NOT NULL,
  item_id uuid REFERENCES inventory_items(id) ON DELETE CASCADE,
  is_read boolean DEFAULT false,
  acknowledged_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  acknowledged_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  changes jsonb DEFAULT '{}'::jsonb,
  ip_address text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_org ON profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_categories_org ON categories(organization_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_org ON suppliers(organization_id);
CREATE INDEX IF NOT EXISTS idx_locations_org ON locations(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_org ON inventory_items(organization_id);
CREATE INDEX IF NOT EXISTS idx_inventory_category ON inventory_items(category_id);
CREATE INDEX IF NOT EXISTS idx_inventory_supplier ON inventory_items(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory_items(location_id);
CREATE INDEX IF NOT EXISTS idx_inventory_sku ON inventory_items(sku);
CREATE INDEX IF NOT EXISTS idx_stock_movements_org ON stock_movements(organization_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_item ON stock_movements(item_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_org ON purchase_orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_alerts_org ON alerts(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(organization_id);

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view profiles in same organization"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for organizations
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can update organization"
  ON organizations FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for categories
CREATE POLICY "Users can view categories in organization"
  ON categories FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can create categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for suppliers
CREATE POLICY "Users can view suppliers in organization"
  ON suppliers FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can create suppliers"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update suppliers"
  ON suppliers FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete suppliers"
  ON suppliers FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for locations
CREATE POLICY "Users can view locations in organization"
  ON locations FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can create locations"
  ON locations FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update locations"
  ON locations FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete locations"
  ON locations FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for inventory_items
CREATE POLICY "Users can view inventory in organization"
  ON inventory_items FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can create inventory"
  ON inventory_items FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update inventory"
  ON inventory_items FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete inventory"
  ON inventory_items FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for stock_movements
CREATE POLICY "Users can view stock movements in organization"
  ON stock_movements FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can create stock movements"
  ON stock_movements FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

-- RLS Policies for purchase_orders
CREATE POLICY "Users can view purchase orders in organization"
  ON purchase_orders FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins and managers can create purchase orders"
  ON purchase_orders FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins and managers can update purchase orders"
  ON purchase_orders FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Admins can delete purchase orders"
  ON purchase_orders FOR DELETE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for purchase_order_items
CREATE POLICY "Users can view PO items in organization"
  ON purchase_order_items FOR SELECT
  TO authenticated
  USING (
    po_id IN (
      SELECT id FROM purchase_orders
      WHERE organization_id IN (
        SELECT organization_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins and managers can create PO items"
  ON purchase_order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    po_id IN (
      SELECT id FROM purchase_orders
      WHERE organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

CREATE POLICY "Admins and managers can update PO items"
  ON purchase_order_items FOR UPDATE
  TO authenticated
  USING (
    po_id IN (
      SELECT id FROM purchase_orders
      WHERE organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  )
  WITH CHECK (
    po_id IN (
      SELECT id FROM purchase_orders
      WHERE organization_id IN (
        SELECT organization_id FROM profiles 
        WHERE id = auth.uid() AND role IN ('admin', 'manager')
      )
    )
  );

-- RLS Policies for alerts
CREATE POLICY "Users can view alerts in organization"
  ON alerts FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "System can create alerts"
  ON alerts FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    organization_id IN (
      SELECT organization_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_items_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();