import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../context/cartStore';
import { useAuthStore } from '../../context/authStore';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { items } = useCartStore();
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-12 h-12 flex items-center justify-center"
                        >
                            <img src="/logo.png" alt="HungryHut Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <span className="text-2xl font-black text-white tracking-widest uppercase">
                            Hungry<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Hut</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-8">
                        <Link to="/menu" className="text-gray-300 hover:text-white font-medium text-sm tracking-[0.2em] uppercase transition-colors">
                            Menu
                        </Link>
                        <Link to="/reviews" className="text-gray-300 hover:text-white font-medium text-sm tracking-[0.2em] uppercase transition-colors">
                            Reviews
                        </Link>
                        
                        <Link to="/cart" className="relative group flex items-center">
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity">
                                🛒
                            </motion.div>
                            {cartItemCount > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    key={cartItemCount}
                                    className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.6)]"
                                >
                                    {cartItemCount}
                                </motion.span>
                            )}
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-6">
                                {user.role === 'admin' && (
                                    <Link to="/admin/dashboard" className="text-xs font-medium text-gray-500 hover:text-primary tracking-widest uppercase">Admin</Link>
                                )}
                                <button onClick={handleLogout} className="text-xs font-medium text-red-500 hover:text-red-400 tracking-widest uppercase">Logout</button>
                            </div>
                        ) : (
                            <Link to="/admin/login" className="text-xs font-medium text-gray-500 hover:text-gray-300 tracking-widest uppercase">Admin Login</Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
