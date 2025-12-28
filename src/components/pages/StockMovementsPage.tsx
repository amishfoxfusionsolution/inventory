import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowUp, ArrowDown, ArrowLeftRight, Plus, X } from 'lucide-react';

interface StockMovement {
  id: string;
  type: string;
  quantity: number;
  notes: string;
  created_at: string;
  inventory_items: {
    name: string;
    sku: string;
  } | null;
}

export function StockMovementsPage() {
  const { profile } = useAuth();
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (profile?.organization_id) {
      loadMovements();
      loadItems();
    }
  }, [profile?.organization_id]);

  async function loadMovements() {
    if (!profile?.organization_id) return;

    try {
      const { data, error } = await supabase
        .from('stock_movements')
        .select('*, inventory_items(name, sku)')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMovements(data || []);
    } catch (error) {
      console.error('Error loading movements:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadItems() {
    if (!profile?.organization_id) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('name');

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error loading items:', error);
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
            Stock Movements
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all inventory movements
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Record Movement
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {movements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No stock movements recorded
                  </td>
                </tr>
              ) : (
                movements.map((movement) => (
                  <tr
                    key={movement.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg ${
                            movement.type === 'inbound'
                              ? 'bg-green-100 dark:bg-green-900/20'
                              : movement.type === 'outbound'
                              ? 'bg-red-100 dark:bg-red-900/20'
                              : 'bg-blue-100 dark:bg-blue-900/20'
                          }`}
                        >
                          {movement.type === 'inbound' ? (
                            <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                          ) : movement.type === 'outbound' ? (
                            <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                          ) : (
                            <ArrowLeftRight className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {movement.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {movement.inventory_items?.name || 'Unknown Item'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SKU: {movement.inventory_items?.sku}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-semibold ${
                          movement.type === 'inbound'
                            ? 'text-green-600 dark:text-green-400'
                            : movement.type === 'outbound'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      >
                        {movement.type === 'inbound' ? '+' : movement.type === 'outbound' ? '-' : ''}
                        {movement.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {movement.notes || '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(movement.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <MovementModal
          onClose={() => setShowAddModal(false)}
          onSave={loadMovements}
          items={items}
        />
      )}
    </div>
  );
}

interface MovementModalProps {
  onClose: () => void;
  onSave: () => void;
  items: any[];
}

function MovementModal({ onClose, onSave, items }: MovementModalProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    item_id: '',
    type: 'inbound' as 'inbound' | 'outbound' | 'adjustment',
    quantity: 0,
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedItem = items.find(i => i.id === formData.item_id);
      if (!selectedItem) {
        alert('Please select an item');
        setLoading(false);
        return;
      }

      const newQuantity = formData.type === 'inbound'
        ? selectedItem.quantity + formData.quantity
        : formData.type === 'outbound'
        ? selectedItem.quantity - formData.quantity
        : formData.quantity;

      if (newQuantity < 0) {
        alert('Insufficient stock for this operation');
        setLoading(false);
        return;
      }

      await supabase
        .from('stock_movements')
        .insert([{
          organization_id: profile?.organization_id,
          item_id: formData.item_id,
          type: formData.type,
          quantity: formData.quantity,
          notes: formData.notes,
          performed_by: profile?.id,
        }]);

      await supabase
        .from('inventory_items')
        .update({ quantity: newQuantity })
        .eq('id', formData.item_id);

      onSave();
      onClose();
    } catch (error) {
      console.error('Error recording movement:', error);
      alert('Error recording movement. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Record Stock Movement
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
              Item
            </label>
            <select
              required
              value={formData.item_id}
              onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select an item</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.sku} (Current: {item.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Movement Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="inbound">Inbound (Add Stock)</option>
              <option value="outbound">Outbound (Remove Stock)</option>
              <option value="adjustment">Adjustment (Set Quantity)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
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
              {loading ? 'Recording...' : 'Record Movement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
