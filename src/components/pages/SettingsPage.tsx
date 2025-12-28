import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Building, Bell, Shield } from 'lucide-react';

export function SettingsPage() {
  const { profile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await updateProfile({ full_name: formData.full_name });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profile Information
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {message && (
                <div className={`p-3 rounded-lg ${
                  message.includes('success')
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notification Preferences
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Low Stock Alerts
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get notified when items are running low
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Expiry Warnings
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Alerts for items nearing expiration
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Daily Reports
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Receive daily inventory summaries
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Account Info
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Role</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white capitalize mt-1">
                  {profile?.role}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Member Since</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                  {new Date(profile?.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Building className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Organization
              </h2>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Organization settings and team management available to admins only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
