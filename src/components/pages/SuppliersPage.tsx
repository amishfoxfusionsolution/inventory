import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, X, Truck, Mail, Phone, MapPin } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  lead_time_days: number;
  notes: string;
}

export function SuppliersPage() {
  const { profile } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  useEffect(() => {
    if (profile?.organization_id) {
      loadSuppliers();
    }
  }, [profile?.organization_id]);

  async function loadSuppliers() {
    if (!profile?.organization_id) return;

    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('name');

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error loading suppliers:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteSupplier(id: string) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  }

  const canEdit = profile?.role === 'admin' || profile?.role === 'manager';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Suppliers
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your supplier relationships
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setSelectedSupplier(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Supplier
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {suppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {supplier.name}
                  </h3>
                  {supplier.contact_person && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {supplier.contact_person}
                    </p>
                  )}
                </div>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedSupplier(supplier);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => deleteSupplier(supplier.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${supplier.email}`} className="hover:text-blue-600">
                    {supplier.email}
                  </a>
                </div>
              )}
              {supplier.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${supplier.phone}`} className="hover:text-blue-600">
                    {supplier.phone}
                  </a>
                </div>
              )}
              {supplier.address && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{supplier.address}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Lead Time</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {supplier.lead_time_days} days
                </span>
              </div>
              {supplier.notes && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {supplier.notes}
                </p>
              )}
            </div>
          </div>
        ))}

        {suppliers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Truck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No suppliers yet. Add one to get started.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <SupplierModal
          supplier={selectedSupplier}
          onClose={() => {
            setShowModal(false);
            setSelectedSupplier(null);
          }}
          onSave={loadSuppliers}
        />
      )}
    </div>
  );
}

interface SupplierModalProps {
  supplier: Supplier | null;
  onClose: () => void;
  onSave: () => void;
}

function SupplierModal({ supplier, onClose, onSave }: SupplierModalProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    name: supplier?.name || '',
    contact_person: supplier?.contact_person || '',
    email: supplier?.email || '',
    phone: supplier?.phone || '',
    address: supplier?.address || '',
    lead_time_days: supplier?.lead_time_days || 7,
    notes: supplier?.notes || '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        organization_id: profile?.organization_id,
      };

      if (supplier) {
        const { error } = await supabase
          .from('suppliers')
          .update(data)
          .eq('id', supplier.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('suppliers')
          .insert([data]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Error saving supplier. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Supplier Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Person
            </label>
            <input
              type="text"
              value={formData.contact_person}
              onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Lead Time (days)
            </label>
            <input
              type="number"
              value={formData.lead_time_days}
              onChange={(e) => setFormData({ ...formData, lead_time_days: parseInt(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : supplier ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
