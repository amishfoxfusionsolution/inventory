import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import {
  Package,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Calendar
} from 'lucide-react';

interface DashboardMetrics {
  totalItems: number;
  lowStockItems: number;
  totalValue: number;
  stockMovements: number;
  recentMovements: any[];
  topItems: any[];
  alerts: any[];
}

export function Dashboard() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    stockMovements: 0,
    recentMovements: [],
    topItems: [],
    alerts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.organization_id) {
      loadDashboardData();
      subscribeToUpdates();
    }
  }, [profile?.organization_id]);

  async function loadDashboardData() {
    if (!profile?.organization_id) return;

    try {
      const [itemsResult, movementsResult, alertsResult] = await Promise.all([
        supabase
          .from('inventory_items')
          .select('*')
          .eq('organization_id', profile.organization_id),
        supabase
          .from('stock_movements')
          .select('*, inventory_items(name)')
          .eq('organization_id', profile.organization_id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('alerts')
          .select('*, inventory_items(name)')
          .eq('organization_id', profile.organization_id)
          .eq('is_read', false)
          .order('created_at', { ascending: false })
          .limit(5),
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

        const topItems = items
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        setMetrics({
          totalItems: items.length,
          lowStockItems: lowStock,
          totalValue,
          stockMovements: movementsResult.data?.length || 0,
          recentMovements: movementsResult.data || [],
          topItems,
          alerts: alertsResult.data || [],
        });
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToUpdates() {
    if (!profile?.organization_id) return;

    const channel = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'inventory_items',
          filter: `organization_id=eq.${profile.organization_id}`,
        },
        () => {
          loadDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Welcome back, {profile?.full_name}! Here's your inventory overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Items"
          value={metrics.totalItems.toString()}
          icon={Package}
          color="blue"
          trend="+12%"
          trendUp={true}
        />
        <MetricCard
          title="Low Stock Alerts"
          value={metrics.lowStockItems.toString()}
          icon={AlertTriangle}
          color="red"
          trend="-5%"
          trendUp={false}
        />
        <MetricCard
          title="Total Inventory Value"
          value={`$${metrics.totalValue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend="+8%"
          trendUp={true}
        />
        <MetricCard
          title="Stock Movements"
          value={metrics.stockMovements.toString()}
          icon={TrendingUp}
          color="purple"
          trend="+23%"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Stock Movements
          </h2>
          <div className="space-y-3">
            {metrics.recentMovements.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No recent movements
              </p>
            ) : (
              metrics.recentMovements.map((movement: any) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        movement.type === 'inbound'
                          ? 'bg-green-100 dark:bg-green-900/20'
                          : 'bg-red-100 dark:bg-red-900/20'
                      }`}
                    >
                      {movement.type === 'inbound' ? (
                        <ArrowUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {movement.inventory_items?.name || 'Unknown Item'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {movement.type} • {movement.quantity} units
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(movement.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Active Alerts
          </h2>
          <div className="space-y-3">
            {metrics.alerts.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No active alerts
              </p>
            ) : (
              metrics.alerts.map((alert: any) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'critical'
                      ? 'bg-red-50 dark:bg-red-900/10 border-red-500'
                      : alert.severity === 'high'
                      ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-500'
                      : 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`w-4 h-4 mt-0.5 ${
                        alert.severity === 'critical'
                          ? 'text-red-600'
                          : alert.severity === 'high'
                          ? 'text-orange-600'
                          : 'text-yellow-600'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Items by Stock
        </h2>
        <div className="space-y-3">
          {metrics.topItems.map((item: any, index: number) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-gray-400">
                  #{index + 1}
                </span>
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
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: any;
  color: 'blue' | 'red' | 'green' | 'purple';
  trend?: string;
  trendUp?: boolean;
}

function MetricCard({ title, value, icon: Icon, color, trend, trendUp }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    red: 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400',
    green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    purple: 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium flex items-center gap-1 ${
              trendUp ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {trend}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
        {title}
      </h3>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}
