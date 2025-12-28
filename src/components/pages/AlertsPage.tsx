import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { AlertTriangle, CheckCircle, Clock, Package } from 'lucide-react';

interface Alert {
  id: string;
  type: string;
  severity: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  inventory_items: {
    name: string;
  } | null;
}

export function AlertsPage() {
  const { profile } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (profile?.organization_id) {
      loadAlerts();
      subscribeToAlerts();
    }
  }, [profile?.organization_id]);

  async function loadAlerts() {
    if (!profile?.organization_id) return;

    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*, inventory_items(name)')
        .eq('organization_id', profile.organization_id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  }

  function subscribeToAlerts() {
    if (!profile?.organization_id) return;

    const channel = supabase
      .channel('alerts-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'alerts',
          filter: `organization_id=eq.${profile.organization_id}`,
        },
        () => {
          loadAlerts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  async function markAsRead(id: string) {
    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true, acknowledged_by: profile?.id, acknowledged_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      loadAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
    }
  }

  async function markAllAsRead() {
    if (!profile?.organization_id) return;

    try {
      const { error } = await supabase
        .from('alerts')
        .update({ is_read: true, acknowledged_by: profile?.id, acknowledged_at: new Date().toISOString() })
        .eq('organization_id', profile.organization_id)
        .eq('is_read', false);

      if (error) throw error;
      loadAlerts();
    } catch (error) {
      console.error('Error marking all alerts as read:', error);
    }
  }

  const filteredAlerts = filter === 'unread' ? alerts.filter(a => !a.is_read) : alerts;
  const unreadCount = alerts.filter(a => !a.is_read).length;

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
            Alerts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {unreadCount} unread {unreadCount === 1 ? 'alert' : 'alerts'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <CheckCircle className="w-5 h-5" />
            Mark All as Read
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'all'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          All ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 font-medium transition-colors ${
            filter === 'unread'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No {filter === 'unread' ? 'unread ' : ''}alerts
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-l-4 transition-all ${
                alert.severity === 'critical'
                  ? 'border-red-500'
                  : alert.severity === 'high'
                  ? 'border-orange-500'
                  : alert.severity === 'medium'
                  ? 'border-yellow-500'
                  : 'border-blue-500'
              } ${
                alert.is_read ? 'opacity-60' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      alert.severity === 'critical'
                        ? 'bg-red-100 dark:bg-red-900/20'
                        : alert.severity === 'high'
                        ? 'bg-orange-100 dark:bg-orange-900/20'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20'
                        : 'bg-blue-100 dark:bg-blue-900/20'
                    }`}
                  >
                    {alert.type === 'low_stock' ? (
                      <Package
                        className={`w-6 h-6 ${
                          alert.severity === 'critical'
                            ? 'text-red-600 dark:text-red-400'
                            : alert.severity === 'high'
                            ? 'text-orange-600 dark:text-orange-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                        }`}
                      />
                    ) : alert.type === 'expiry' ? (
                      <Clock
                        className={`w-6 h-6 ${
                          alert.severity === 'critical'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-orange-600 dark:text-orange-400'
                        }`}
                      />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {alert.title}
                        </h3>
                        {alert.inventory_items?.name && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {alert.inventory_items.name}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          alert.severity === 'critical'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            : alert.severity === 'high'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                            : alert.severity === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}
                      >
                        {alert.severity}
                      </span>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      {alert.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(alert.created_at).toLocaleString()}
                      </span>
                      {!alert.is_read && (
                        <button
                          onClick={() => markAsRead(alert.id)}
                          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
