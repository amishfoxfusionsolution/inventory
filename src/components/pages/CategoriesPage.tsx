import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, X, FolderTree } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  parent_id: string | null;
}

export function CategoriesPage() {
  const { profile } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    if (profile?.organization_id) {
      loadCategories();
    }
  }, [profile?.organization_id]);

  async function loadCategories() {
    if (!profile?.organization_id) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('organization_id', profile.organization_id)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategory(id: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
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
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize your inventory with categories
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => {
              setSelectedCategory(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: category.color + '20' }}
              >
                <FolderTree
                  className="w-6 h-6"
                  style={{ color: category.color }}
                />
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {profile?.role === 'admin' && (
                    <button
                      onClick={() => deleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {category.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {category.description || 'No description'}
            </p>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full text-center py-12">
            <FolderTree className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No categories yet. Create one to get started.
            </p>
          </div>
        )}
      </div>

      {showModal && (
        <CategoryModal
          category={selectedCategory}
          onClose={() => {
            setShowModal(false);
            setSelectedCategory(null);
          }}
          onSave={loadCategories}
          categories={categories}
        />
      )}
    </div>
  );
}

interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onSave: () => void;
  categories: Category[];
}

function CategoryModal({ category, onClose, onSave, categories }: CategoryModalProps) {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#3B82F6',
    parent_id: category?.parent_id || '',
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        parent_id: formData.parent_id || null,
        organization_id: profile?.organization_id,
      };

      if (category) {
        const { error } = await supabase
          .from('categories')
          .update(data)
          .eq('id', category.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([data]);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#14B8A6', '#F97316', '#6366F1'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {category ? 'Edit Category' : 'Add New Category'}
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
              Name
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
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-full h-10 rounded-lg transition-transform ${
                    formData.color === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
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
              {loading ? 'Saving...' : category ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
