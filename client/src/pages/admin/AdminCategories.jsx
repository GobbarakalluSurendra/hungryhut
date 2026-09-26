import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            setIsFormOpen(false);
            setEditingId(null);
            setFormData({ name: '', description: '', isActive: true });
            fetchCategories();
        } catch (error) {
            console.error('Failed to save category', error);
        }
    };

    const handleEdit = (category) => {
        setFormData({ name: category.name, description: category.description, isActive: category.isActive });
        setEditingId(category._id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await api.delete(`/categories/${id}`);
                fetchCategories();
            } catch (error) {
                console.error('Failed to delete category', error);
            }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-full">
            <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-gray-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white">Categories Menu</h1>
                    <p className="text-gray-400 mt-1">Manage your food categorization</p>
                </div>
                <button 
                    onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ name: '', description: '', isActive: true }) }}
                    className="bg-primary text-black font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                    + New Category
                </button>
            </div>

            <AnimatePresence>
                {isFormOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-zinc-900 border border-white/5 rounded-2xl p-8 mb-8 overflow-hidden shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-white">{editingId ? 'Edit Category' : 'Create Category'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Category Name</label>
                                <input 
                                    type="text" required 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors h-24"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})}
                                    className="w-5 h-5 accent-primary bg-black border-white/10 rounded cursor-pointer"
                                />
                                <label className="text-gray-300 font-medium cursor-pointer">Category is currently Active (Visible to customers)</label>
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-white/5">
                                <button type="submit" className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-3 rounded-xl hover:bg-amber-400 transition-colors">
                                    Save Category
                                </button>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="bg-transparent border border-white/20 text-gray-300 hover:text-white font-bold uppercase tracking-wider px-8 py-3 rounded-xl transition-colors">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-5 font-semibold border-b border-white/5">Category Name</th>
                                <th className="p-5 font-semibold border-b border-white/5">Status</th>
                                <th className="p-5 font-semibold border-b border-white/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.map(category => (
                                <tr key={category._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-5 whitespace-nowrap text-white font-bold text-lg">{category.name}</td>
                                    <td className="p-5 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-widest ${category.isActive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                            {category.isActive ? 'Active' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="p-5 whitespace-nowrap text-right space-x-4">
                                        <button onClick={() => handleEdit(category)} className="text-gray-400 hover:text-amber-500 font-bold transition-colors">Edit</button>
                                        <button onClick={() => handleDelete(category._id)} className="text-gray-400 hover:text-red-500 font-bold transition-colors">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
