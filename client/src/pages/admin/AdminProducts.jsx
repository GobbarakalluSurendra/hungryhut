import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';
import { FaImage, FaLeaf, FaDrumstickBite } from 'react-icons/fa';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '', isVeg: true, isAvailable: true, imageUrl: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products?all=true');
            setProducts(res.data.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/categories');
            setCategories(res.data.data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('image', file);
        setUploadingImage(true);

        try {
            const res = await api.post('/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, imageUrl: res.data.imageUrl });
        } catch (error) {
            console.error('Failed to upload image', error);
            alert('Image upload failed. Ensure it is a valid image file.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/products/${editingId}`, formData);
            } else {
                await api.post('/products', formData);
            }
            setIsFormOpen(false);
            setEditingId(null);
            setFormData({ name: '', description: '', price: '', category: '', isVeg: true, isAvailable: true, imageUrl: '' });
            fetchProducts();
        } catch (error) {
            console.error('Failed to save product', error);
        }
    };

    const handleEdit = (product) => {
        setFormData({ 
            name: product.name, 
            description: product.description || '', 
            price: product.price, 
            category: product.category._id, 
            isVeg: product.isVeg, 
            isAvailable: product.isAvailable,
            imageUrl: product.imageUrl || ''
        });
        setEditingId(product._id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Failed to delete product', error);
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
                    <h1 className="text-4xl font-black tracking-tight text-white">Products Catalog</h1>
                    <p className="text-gray-400 mt-1">Manage your restaurant's food items</p>
                </div>
                <button 
                    onClick={() => { setIsFormOpen(true); setEditingId(null); setFormData({ name: '', description: '', price: '', category: '', isVeg: true, isAvailable: true, imageUrl: '' }) }}
                    className="bg-primary text-black font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                >
                    + New Product
                </button>
            </div>

            <AnimatePresence>
                {isFormOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        className="bg-zinc-900 border border-white/5 rounded-2xl p-8 mb-8 overflow-hidden shadow-2xl"
                    >
                        <h2 className="text-2xl font-bold mb-6 text-white">{editingId ? 'Edit Product' : 'Create Product'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Product Name</label>
                                <input 
                                    type="text" required 
                                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                            </div>
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label>
                                <textarea 
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors h-24"
                                />
                            </div>

                            {/* Image Upload Section */}
                            <div className="md:col-span-2 bg-black border border-white/10 rounded-xl p-6 flex items-center gap-6">
                                {formData.imageUrl ? (
                                    <div className="relative group">
                                        <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow-lg border border-white/10" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <FaImage className="text-white text-xl" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 border-dashed">
                                        <FaImage className="text-gray-500 text-3xl" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Product Image</label>
                                    <input 
                                        type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage}
                                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:uppercase file:tracking-wider file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer"
                                    />
                                    {uploadingImage && <p className="text-sm text-amber-500 mt-2 font-bold animate-pulse">Uploading Image...</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Price (₹)</label>
                                <input 
                                    type="number" required min="0" step="1"
                                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                                <select 
                                    required
                                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors appearance-none"
                                >
                                    <option value="" className="bg-zinc-900">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id} className="bg-zinc-900">{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-3 bg-black border border-white/10 rounded-xl p-4">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isVeg} onChange={e => setFormData({...formData, isVeg: e.target.checked})}
                                    className="w-5 h-5 accent-green-500 bg-black border-white/10 rounded cursor-pointer"
                                />
                                <label className="text-gray-300 font-medium cursor-pointer flex items-center gap-2">
                                    <FaLeaf className="text-green-500"/> Vegetarian Product
                                </label>
                            </div>

                            <div className="flex items-center gap-3 bg-black border border-white/10 rounded-xl p-4">
                                <input 
                                    type="checkbox" 
                                    checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})}
                                    className="w-5 h-5 accent-primary bg-black border-white/10 rounded cursor-pointer"
                                />
                                <label className="text-gray-300 font-medium cursor-pointer">Available in Menu</label>
                            </div>
                            
                            <div className="md:col-span-2 flex gap-4 pt-4 border-t border-white/5">
                                <button type="submit" disabled={uploadingImage} className="bg-primary text-black font-bold uppercase tracking-wider px-8 py-3 rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50">
                                    Save Product
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
                                <th className="p-5 font-semibold border-b border-white/5 w-20">Image</th>
                                <th className="p-5 font-semibold border-b border-white/5">Name</th>
                                <th className="p-5 font-semibold border-b border-white/5">Category</th>
                                <th className="p-5 font-semibold border-b border-white/5">Price</th>
                                <th className="p-5 font-semibold border-b border-white/5">Type</th>
                                <th className="p-5 font-semibold border-b border-white/5">Status</th>
                                <th className="p-5 font-semibold border-b border-white/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map(product => (
                                <tr key={product._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 whitespace-nowrap">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="h-12 w-12 rounded-lg object-cover border border-white/10" />
                                        ) : (
                                            <div className="h-12 w-12 rounded-lg bg-black flex items-center justify-center border border-white/5">
                                                <FaImage className="text-gray-600" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-5 whitespace-nowrap text-white font-bold text-lg">{product.name}</td>
                                    <td className="p-5 whitespace-nowrap text-gray-400">{product.category?.name || 'Uncategorized'}</td>
                                    <td className="p-5 whitespace-nowrap font-black text-amber-500">₹{product.price}</td>
                                    <td className="p-5 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            {product.isVeg ? <FaLeaf className="text-green-500" /> : <FaDrumstickBite className="text-red-500" />}
                                            <span className="text-gray-300 font-bold">{product.isVeg ? 'Veg' : 'Non-Veg'}</span>
                                        </div>
                                    </td>
                                    <td className="p-5 whitespace-nowrap">
                                        <span className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-widest ${product.isAvailable ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-400'}`}>
                                            {product.isAvailable ? 'Available' : 'Hidden'}
                                        </span>
                                    </td>
                                    <td className="p-5 whitespace-nowrap text-right space-x-4">
                                        <button onClick={() => handleEdit(product)} className="text-gray-400 hover:text-amber-500 font-bold transition-colors">Edit</button>
                                        <button onClick={() => handleDelete(product._id)} className="text-gray-400 hover:text-red-500 font-bold transition-colors">Delete</button>
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
