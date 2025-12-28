import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Download, TrendingUp, DollarSign, Package, BarChart } from 'lucide-react';

export function ReportsPage() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState({
    totalValue: 0,
    totalItems: 0,
    lowStockCount: 0,
    movementsThisMonth: 0,
    topSellingItems: [] as any[],
    categoryBreakdown: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.organization_id) {
      loadReportsData();
    }
  }, [profile?.organization_id]);

  async function loadReportsData() {
    if (!profile?.organization_id) return;

    try {
      const [itemsResult, movementsResult, categoriesResult] = await Promise.all([
        supabase
          .from('inventory_items')
          .select('*')
          .eq('organization_id', profile.organization_id),
        supabase
          .from('stock_movements')
          .select('*')
          .eq('organization_id', profile.organization_id)
          .gte('created_at', new Date(new Date().setDate(1)).toISOString()),
        supabase
          .from('categories')
          .select('*, inventory_items(*)')
          .eq('organization_id', profile.organization_id),
      ]);

      if (itemsResult.data) {
        const items = itemsResult.data;
        const totalValue = items.reduce(
          (sum, item) => sum + item.quantity * item.unit_cost,
          0
        );
        const lowStock = items.filter(
          (item) => item.quantity <= item.reorder_level
        ).length;

        const topSelling = items
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        const categoryData = categoriesResult.data?.map((cat: any) => ({
          name: cat.name,
          count: cat.inventory_items?.length || 0,
          value: cat.inventory_items?.reduce(
            (sum: number, item: any) => sum + item.quantity * item.unit_cost,
            0
          ) || 0,
        })) || [];

        setMetrics({
          totalValue,
          totalItems: items.length,
          lowStockCount: lowStock,
          movementsThisMonth: movementsResult.data?.length || 0,
          topSellingItems: topSelling,
          categoryBreakdown: categoryData,
        });
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  }

  async function exportToCSV() {
    if (!profile?.organization_id) return;

    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('organization_id', profile.organization_id);

      if (error) throw error;

      const csv = [
        ['SKU', 'Name', 'Quantity', 'Unit', 'Unit Cost', 'Selling Price', 'Status'].join(','),
        ...data.map(item =>
          [
            item.sku,
            item.name,
            item.quantity,
            item.unit,
            item.unit_cost,
            item.selling_price,
            item.status
          ].join(',')
        )
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  }

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
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Insights and data exports for your inventory
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ${metrics.totalValue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {metrics.totalItems}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock Items</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {metrics.lowStockCount}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BarChart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Movements (This Month)</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {metrics.movementsThisMonth}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Items by Stock
          </h2>
          <div className="space-y-3">
            {metrics.topSellingItems.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SKU: {item.sku}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.quantity} {item.unit}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ${(item.quantity * item.unit_cost).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Category Breakdown
          </h2>
          <div className="space-y-3">
            {metrics.categoryBreakdown.map((category) => (
              <div key={category.name} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    ${category.value.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{category.count} items</span>
                </div>
              </div>
            ))}
            {metrics.categoryBreakdown.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                No categories with items yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportToCSV}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Full Inventory Export
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  CSV format with all items
                </p>
              </div>
            </div>
          </button>

          <button className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <BarChart className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Stock Movement Report
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Transaction history
                </p>
              </div>
            </div>
          </button>

          <button className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Low Stock Report
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Items needing reorder
                </p>
              </div>
            </div>
          </button>

          <button className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Valuation Report
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Current inventory value
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
