import { useEffect, useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { io } from 'socket.io-client';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLayout() {
    const { isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) return;

        // Initialize Socket.io connecting to backend
        const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');
        
        socket.on('connect', () => {
            console.log('Admin Socket connected');
            socket.emit('join_admin');
        });

        socket.on('new_order', (data) => {
            // Play a ding sound using browser API
            try {
                const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
                audio.play();
            } catch(e) { console.error('Audio play failed', e); }

            toast.success(
                <div>
                    <strong>New Order Received!</strong>
                    <br/>{data.message}
                    <br/><span className="text-sm opacity-75">ID: {data.orderId}</span>
                </div>, 
                { duration: 8000, position: 'top-right' }
            );
        });

        return () => {
            socket.disconnect();
        };
    }, [isAuthenticated]);

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">
            <Toaster />
            
            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button 
                    onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    className="p-3 bg-zinc-900 border border-white/10 rounded-xl text-white shadow-lg"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileSidebarOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileSidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setIsMobileSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed md:relative z-50 w-64 h-full bg-zinc-950 text-white border-r border-white/5 transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="p-4 text-2xl font-black tracking-tighter text-primary text-center border-b border-white/5 py-6 flex flex-col items-center">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain mb-2" />
                    <div>Hungry<span className="text-white">Hut</span></div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin Portal</div>
                </div>
                <nav className="mt-6 flex flex-col gap-2 px-4 overflow-y-auto pb-20">
                    <Link onClick={() => setIsMobileSidebarOpen(false)} to="/admin/dashboard" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Dashboard</Link>
                    <Link onClick={() => setIsMobileSidebarOpen(false)} to="/admin/categories" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Categories</Link>
                    <Link onClick={() => setIsMobileSidebarOpen(false)} to="/admin/products" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Products</Link>
                    <Link onClick={() => setIsMobileSidebarOpen(false)} to="/admin/orders" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Orders</Link>
                    <Link onClick={() => setIsMobileSidebarOpen(false)} to="/admin/reviews" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Reviews</Link>
                    <Link onClick={() => setIsMobileSidebarOpen(false)} to="/admin/settings" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Settings</Link>
                    <button onClick={logout} className="p-3 rounded-lg hover:bg-red-500/10 text-left text-red-500 font-bold transition-colors mt-8 border border-red-500/20">Logout</button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-4 md:p-8 w-full">
                <Outlet />
            </div>
        </div>
    );
}
