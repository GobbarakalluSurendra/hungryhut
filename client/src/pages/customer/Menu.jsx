import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api';
import { useCartStore } from '../../context/cartStore';

export default function Menu() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const addToCart = useCartStore(state => state.addToCart);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, prodsRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/products?all=true')
                ]);
                setCategories(catsRes.data.data);
                setProducts(prodsRes.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching menu", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // A collection of high-quality, reliable static food images for fallback
    const defaultFoodImages = [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80", // Pizza
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80", // Burger
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80", // Pasta/Meat
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80", // Healthy Bowl
        "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80", // Sushi
        "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80", // Meatballs
    ];

    const getDeterministicImage = (id) => {
        // Use the last character of the MongoDB ID to pick a consistent image
        const charCode = id.charCodeAt(id.length - 1);
        return defaultFoodImages[charCode % defaultFoodImages.length];
    };

    const filteredProducts = activeCategory === 'All' 
        ? products 
        : products.filter(p => p.category && p.category.name === activeCategory);

    if (loading) return (
        <div className="min-h-screen pt-24 flex items-center justify-center bg-black">
            <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-zinc-800 border-t-primary rounded-full"
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
                        OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">MENU</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light">Curated delicacies crafted to perfection.</p>
                </motion.div>

                {/* Categories */}
                <div className="flex overflow-x-auto pb-6 mb-12 gap-4 no-scrollbar justify-start md:justify-center">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveCategory('All')}
                        className={`whitespace-nowrap px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                            activeCategory === 'All' 
                            ? 'bg-gradient-to-r from-primary to-orange-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                            : 'bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800 hover:border-primary/50'
                        }`}
                    >
                        All
                    </motion.button>
                    {categories.map(cat => (
                        <motion.button
                            key={cat._id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`whitespace-nowrap px-8 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all duration-300 ${
                                activeCategory === cat.name 
                                ? 'bg-gradient-to-r from-primary to-orange-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                                : 'bg-zinc-900 text-gray-400 hover:text-white border border-zinc-800 hover:border-primary/50'
                            }`}
                        >
                            {cat.name}
                        </motion.button>
                    ))}
                </div>

                {/* Products Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {filteredProducts.map((product) => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                                key={product._id} 
                                className="group relative bg-zinc-900/50 backdrop-blur-md rounded-3xl overflow-hidden border border-zinc-800/50 hover:border-primary/50 transition-colors duration-500"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10 pointer-events-none"></div>
                                
                                <div className="h-64 overflow-hidden relative bg-zinc-900">
                                    {/* Fallback Emoji if image fails to load, placed behind */}
                                    <div className="absolute inset-0 flex justify-center items-center text-7xl group-hover:scale-125 transition-transform duration-700 ease-out z-0 opacity-20">
                                        🍲
                                    </div>
                                    <img 
                                        src={product.imageUrl || getDeterministicImage(product._id)} 
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 z-10 relative"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none"></div>
                                    
                                    {product.isVeg && (
                                        <div className="absolute top-4 right-4 bg-green-500/20 backdrop-blur-md border border-green-500/50 w-6 h-6 rounded-sm flex items-center justify-center z-20">
                                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-6 relative z-20 -mt-12">
                                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-primary transition-colors">{product.name}</h3>
                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10 font-light">{product.description}</p>
                                    
                                    <div className="flex items-end justify-between mt-auto">
                                        <div>
                                            <span className="text-sm text-gray-500 tracking-widest uppercase">Price</span>
                                            <div className="text-3xl font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-orange-500 transition-all">
                                                ₹{product.price}
                                            </div>
                                        </div>
                                        
                                        <motion.button 
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => addToCart(product)}
                                            className="w-14 h-14 bg-white/5 border border-white/10 hover:bg-gradient-to-r hover:from-primary hover:to-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl transition-all shadow-lg backdrop-blur-sm"
                                        >
                                            +
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                
                {filteredProducts.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-2xl text-gray-600 font-light">No delicacies found in this category.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
