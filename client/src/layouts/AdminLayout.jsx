import { useEffect } from 'react';
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

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="flex h-screen bg-black">
            <Toaster />
            {/* Sidebar */}
            <div className="w-64 bg-zinc-950 text-white border-r border-white/5">
                <div className="p-4 text-2xl font-black tracking-tighter text-primary text-center border-b border-white/5 py-6 flex flex-col items-center">
                    <img src="/logo.png" alt="Logo" className="w-16 h-16 object-contain mb-2" />
                    <div>Hungry<span className="text-white">Hut</span></div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Admin Portal</div>
                </div>
                <nav className="mt-6 flex flex-col gap-2 px-4">
                    <Link to="/admin/dashboard" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Dashboard</Link>
                    <Link to="/admin/categories" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Categories</Link>
                    <Link to="/admin/products" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Products</Link>
                    <Link to="/admin/orders" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Orders</Link>
                    <Link to="/admin/reviews" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Reviews</Link>
                    <Link to="/admin/settings" className="p-3 rounded-lg hover:bg-white/5 transition-colors font-bold text-gray-300 hover:text-white">Settings</Link>
                    <button onClick={logout} className="p-3 rounded-lg hover:bg-red-500/10 text-left text-red-500 font-bold transition-colors mt-8 border border-red-500/20">Logout</button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                <Outlet />
            </div>
        </div>
    );
}
