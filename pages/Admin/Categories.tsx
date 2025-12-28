
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Tag, X } from 'lucide-react';
import { Category } from '../../types';
import { db } from '../../services/db';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  useEffect(() => {
    setCategories(db.getCategories());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name) return;
    
    let updated;
    if (editingCategory.id) {
      updated = categories.map(c => c.id === editingCategory.id ? editingCategory as Category : c);
    } else {
      const newCat = { 
        ...editingCategory, 
        id: `cat-${Date.now()}`, 
        slug: editingCategory.name.toLowerCase().replace(/\s+/g, '-') 
      } as Category;
      updated = [...categories, newCat];
    }
    setCategories(updated);
    db.saveCategories(updated);
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const deleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      const updated = categories.filter(c => c.id !== id);
      setCategories(updated);
      db.saveCategories(updated);
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition duration-200";

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500">Organize your store structure</p>
        </div>
        <button 
          onClick={() => { setEditingCategory({ name: '' }); setIsModalOpen(true); }}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
        >
          <Plus size={20} />
          <span>New Category</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Tag size={20} /></div>
              <div>
                <p className="text-lg font-bold text-gray-900">{cat.name}</p>
                <p className="text-xs text-gray-400 font-medium">/{cat.slug}</p>
              </div>
            </div>
            <div className="flex space-x-1">
              <button onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600 transition"><Edit3 size={18} /></button>
              <button onClick={() => deleteCategory(cat.id)} className="p-2 text-gray-400 hover:text-red-600 transition"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-gray-900">{editingCategory?.id ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Category Name</label>
                <input 
                  required 
                  autoFocus
                  value={editingCategory?.name} 
                  onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} 
                  className={inputClasses} 
                  placeholder="e.g. Home Appliances"
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition">
                {editingCategory?.id ? 'Update Category' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
