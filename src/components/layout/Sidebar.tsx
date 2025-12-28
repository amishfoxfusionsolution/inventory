import {
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  BarChart3,
  Settings,
  Bell,
  ArrowLeftRight,
  FileText
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  collapsed: boolean;
}

export function Sidebar({ currentPage, onNavigate, collapsed }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'suppliers', label: 'Suppliers', icon: Truck },
    { id: 'movements', label: 'Stock Movements', icon: ArrowLeftRight },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
    >
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                {!collapsed && (
                  <span className="font-medium text-sm">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
