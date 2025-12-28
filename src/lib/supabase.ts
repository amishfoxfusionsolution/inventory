import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string;
          role: 'admin' | 'manager' | 'viewer';
          organization_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          description: string;
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          description: string;
          parent_id: string | null;
          color: string;
          created_at: string;
          updated_at: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          contact_person: string;
          email: string;
          phone: string;
          address: string;
          lead_time_days: number;
          notes: string;
          created_at: string;
          updated_at: string;
        };
      };
      locations: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          address: string;
          type: 'warehouse' | 'store' | 'depot';
          created_at: string;
          updated_at: string;
        };
      };
      inventory_items: {
        Row: {
          id: string;
          organization_id: string;
          sku: string;
          barcode: string;
          name: string;
          description: string;
          category_id: string | null;
          supplier_id: string | null;
          location_id: string | null;
          quantity: number;
          unit: string;
          unit_cost: number;
          selling_price: number;
          reorder_level: number;
          reorder_quantity: number;
          expiry_date: string | null;
          serial_numbers: string[];
          images: string[];
          tags: string[];
          status: 'active' | 'discontinued' | 'out_of_stock';
          created_at: string;
          updated_at: string;
        };
      };
      stock_movements: {
        Row: {
          id: string;
          organization_id: string;
          item_id: string;
          type: 'inbound' | 'outbound' | 'transfer' | 'adjustment' | 'stocktake';
          quantity: number;
          from_location_id: string | null;
          to_location_id: string | null;
          reference_number: string;
          unit_cost: number;
          notes: string;
          performed_by: string | null;
          created_at: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          organization_id: string;
          type: 'low_stock' | 'expiry' | 'reorder';
          severity: 'low' | 'medium' | 'high' | 'critical';
          title: string;
          message: string;
          item_id: string | null;
          is_read: boolean;
          acknowledged_by: string | null;
          acknowledged_at: string | null;
          created_at: string;
        };
      };
    };
  };
};
