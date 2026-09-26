import { useCartStore } from '../../context/cartStore';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Cart() {
    const { items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

    // A collection of high-quality, reliable static food images for fallback
    const defaultFoodImages = [
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80",
    ];

    const getDeterministicImage = (id) => {
        const charCode = id.charCodeAt(id.length - 1);
        return defaultFoodImages[charCode % defaultFoodImages.length];
    };

    if (items.length === 0) {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto px-4 py-32 text-center"
            >
                <div className="text-8xl mb-6 opacity-80 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">🛒</div>
                <h2 className="text-3xl font-black text-white mb-4">Your cart is empty</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Go ahead and explore our menu!</p>
                <Link to="/menu" className="bg-gradient-to-r from-primary to-orange-600 text-white px-10 py-4 rounded-full font-bold hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all inline-block">
                    Explore Menu
                </Link>
            </motion.div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen bg-black">
            <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-5xl font-black mb-12 text-white tracking-tighter"
            >
                YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">CART</span>
            </motion.h1>
            
            <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-2/3">
                    <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-800/50 overflow-hidden">
                        <ul className="divide-y divide-zinc-800/50">
                            <AnimatePresence>
                                {items.map(item => (
                                    <motion.li 
                                        key={item.product._id}
                                        layout
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                        transition={{ duration: 0.3 }}
                                        className="p-6 flex flex-col sm:flex-row justify-between items-center hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
                                            <div className="w-24 h-24 bg-black rounded-2xl flex items-center justify-center text-3xl mr-6 shadow-inner overflow-hidden border border-zinc-800">
                                                <img 
                                                    src={item.product.imageUrl || getDeterministicImage(item.product._id)} 
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{item.product.name}</h3>
                                                <p className="text-primary font-black mt-1 text-lg">₹{item.product.price}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                                            <div className="flex items-center border border-zinc-700 rounded-full bg-zinc-900 shadow-sm p-1">
                                                <motion.button 
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-zinc-800 font-bold"
                                                >
                                                    -
                                                </motion.button>
                                                <span className="w-10 text-center font-bold text-white">{item.quantity}</span>
                                                <motion.button 
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-zinc-800 font-bold"
                                                >
                                                    +
                                                </motion.button>
                                            </div>
                                            <motion.button 
                                                whileHover={{ scale: 1.1, rotate: 10 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20 p-3 rounded-full transition-colors border border-red-500/20"
                                                title="Remove item"
                                            >
                                                🗑️
                                            </motion.button>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    </div>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:w-1/3"
                >
                    <div className="bg-zinc-900/50 backdrop-blur-md rounded-3xl shadow-lg border border-zinc-800/50 p-8 sticky top-32">
                        <h2 className="text-2xl font-bold mb-6 text-white">Order Summary</h2>
                        <div className="space-y-4 mb-6 text-gray-400">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="font-medium text-white">₹{getCartTotal()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery Fee</span>
                                <span className="font-medium text-white">₹50</span>
                            </div>
                        </div>
                        <div className="border-t border-zinc-800 pt-6 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-white text-lg">Total</span>
                                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">
                                    ₹{getCartTotal() + 50}
                                </span>
                            </div>
                        </div>
                        <Link to="/checkout" className="block">
                            <motion.button 
                                whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(245,158,11,0.4)" }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full bg-gradient-to-r from-primary to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all text-center"
                            >
                                Proceed to Checkout
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
