/*
  # Add Sample Data for Demo

  ## Overview
  This migration adds sample data for demonstration purposes.
  
  ## Sample Data Includes
  
  1. **Sample Organization**
     - Demo Company with default settings
  
  2. **Sample Categories**
     - Electronics
     - Clothing
     - Food & Beverages
     - Tools & Equipment
     - Office Supplies
  
  3. **Sample Suppliers**
     - TechSupply Inc
     - Fashion Warehouse
     - Food Distributors Co
  
  4. **Sample Locations**
     - Main Warehouse
     - Retail Store
  
  5. **Sample Inventory Items**
     - Multiple items across different categories
     - Various stock levels (including low stock items)
  
  6. **Sample Alerts**
     - Low stock alerts for demonstration
  
  ## Note
  This data is for demonstration purposes only.
*/

-- Create sample organization
INSERT INTO organizations (id, name, description, settings)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Demo Company', 'Sample organization for demonstration', '{"currency": "USD", "timezone": "America/New_York"}')
ON CONFLICT (id) DO NOTHING;

-- Create sample categories
INSERT INTO categories (id, organization_id, name, description, color, parent_id)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Electronics', 'Electronic devices and accessories', '#3B82F6', NULL),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Clothing', 'Apparel and fashion items', '#EF4444', NULL),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Food & Beverages', 'Food products and drinks', '#10B981', NULL),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Tools & Equipment', 'Hardware and tools', '#F59E0B', NULL),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Office Supplies', 'Stationery and office items', '#8B5CF6', NULL)
ON CONFLICT (id) DO NOTHING;

-- Create sample suppliers
INSERT INTO suppliers (id, organization_id, name, contact_person, email, phone, address, lead_time_days, notes)
VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'TechSupply Inc', 'John Smith', 'john@techsupply.com', '+1-555-0101', '123 Tech Street, Silicon Valley, CA 94025', 7, 'Reliable electronics supplier'),
  ('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Fashion Warehouse', 'Sarah Johnson', 'sarah@fashionwh.com', '+1-555-0102', '456 Fashion Ave, New York, NY 10001', 14, 'Wide range of clothing items'),
  ('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Food Distributors Co', 'Mike Brown', 'mike@fooddist.com', '+1-555-0103', '789 Market St, Chicago, IL 60601', 3, 'Fast delivery for perishables'),
  ('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Tools Direct', 'Lisa Anderson', 'lisa@toolsdirect.com', '+1-555-0104', '321 Industrial Blvd, Detroit, MI 48201', 10, 'Quality tools and equipment')
ON CONFLICT (id) DO NOTHING;

-- Create sample locations
INSERT INTO locations (id, organization_id, name, address, type)
VALUES
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Main Warehouse', '100 Warehouse Road, Distribution Center, TX 75001', 'warehouse'),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Downtown Retail Store', '200 Main Street, Downtown, NY 10002', 'store')
ON CONFLICT (id) DO NOTHING;

-- Create sample inventory items
INSERT INTO inventory_items (id, organization_id, sku, name, description, category_id, supplier_id, location_id, quantity, unit, unit_cost, selling_price, reorder_level, reorder_quantity, status)
VALUES
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'ELEC-001', 'Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 150, 'pcs', 12.50, 24.99, 50, 100, 'active'),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'ELEC-002', 'USB-C Cable', '6ft USB-C charging cable', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 25, 'pcs', 3.50, 9.99, 50, 200, 'active'),
  ('40000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'ELEC-003', 'Bluetooth Headphones', 'Noise-cancelling wireless headphones', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 75, 'pcs', 45.00, 89.99, 30, 60, 'active'),
  ('40000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'CLOTH-001', 'Cotton T-Shirt', 'Comfortable cotton t-shirt, various colors', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 8, 'pcs', 8.00, 19.99, 20, 50, 'active'),
  ('40000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'CLOTH-002', 'Denim Jeans', 'Classic fit denim jeans', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 45, 'pcs', 25.00, 59.99, 25, 50, 'active'),
  ('40000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000001', 'FOOD-001', 'Organic Coffee Beans', 'Premium organic coffee beans, 1lb bag', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 120, 'lbs', 8.00, 15.99, 40, 100, 'active'),
  ('40000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000001', 'FOOD-002', 'Energy Bars', 'Protein energy bars, box of 12', '10000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 15, 'box', 12.00, 24.99, 30, 60, 'active'),
  ('40000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000001', 'TOOL-001', 'Power Drill', 'Cordless power drill with battery', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 35, 'pcs', 65.00, 129.99, 15, 30, 'active'),
  ('40000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000001', 'TOOL-002', 'Screwdriver Set', '20-piece screwdriver set', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 60, 'pcs', 15.00, 34.99, 25, 50, 'active'),
  ('40000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', 'OFF-001', 'Printer Paper', 'A4 printer paper, 500 sheets', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 200, 'pcs', 4.50, 9.99, 75, 150, 'active'),
  ('40000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', 'OFF-002', 'Ballpoint Pens', 'Blue ballpoint pens, box of 50', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 5, 'box', 8.00, 16.99, 15, 30, 'active'),
  ('40000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', 'OFF-003', 'Notebooks', 'Spiral notebooks, 100 pages', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000002', 90, 'pcs', 2.50, 6.99, 40, 80, 'active')
ON CONFLICT (id) DO NOTHING;

-- Create sample alerts for low stock items
INSERT INTO alerts (organization_id, type, severity, title, message, item_id, is_read)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'low_stock', 'critical', 'Critical Low Stock', 'USB-C Cable stock is critically low (25 units). Reorder level: 50 units.', '40000000-0000-0000-0000-000000000002', false),
  ('00000000-0000-0000-0000-000000000001', 'low_stock', 'critical', 'Critical Low Stock', 'Cotton T-Shirt stock is critically low (8 units). Reorder level: 20 units.', '40000000-0000-0000-0000-000000000004', false),
  ('00000000-0000-0000-0000-000000000001', 'low_stock', 'high', 'Low Stock Alert', 'Energy Bars stock is low (15 units). Reorder level: 30 units.', '40000000-0000-0000-0000-000000000007', false),
  ('00000000-0000-0000-0000-000000000001', 'low_stock', 'high', 'Low Stock Alert', 'Ballpoint Pens stock is low (5 units). Reorder level: 15 units.', '40000000-0000-0000-0000-000000000011', false)
ON CONFLICT DO NOTHING;