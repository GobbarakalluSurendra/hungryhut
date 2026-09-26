import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { FaRupeeSign, FaShoppingBag, FaClock, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import api from '../../api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        todayOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        todayRevenue: 0,
        recentOrders: []
    });
    
    // Mock chart data for visual flair (we'd calculate this from real data ideally)
    const revenueData = [
        { time: '10 AM', amount: 1200 },
        { time: '12 PM', amount: 3500 },
        { time: '2 PM', amount: 2100 },
        { time: '4 PM', amount: 1500 },
        { time: '6 PM', amount: 4800 },
        { time: '8 PM', amount: 8900 },
        { time: '10 PM', amount: 5400 }
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/orders');
                const orders = res.data.data;
                
                // Calculate real stats
                const today = new Date().setHours(0,0,0,0);
                
                let todayRev = 0;
                let todayOrd = 0;
                let pending = 0;
                let completed = 0;

                orders.forEach(order => {
                    const orderDate = new Date(order.createdAt).setHours(0,0,0,0);
                    if (orderDate === today) {
                        todayOrd++;
                        if (order.paymentStatus === 'PAID' || order.orderType === 'COD') {
                            todayRev += order.totalAmount;
                        }
                    }
                    
                    if (['PENDING_PAYMENT', 'CONFIRMED', 'PREPARING'].includes(order.orderStatus)) {
                        pending++;
                    } else if (order.orderStatus === 'DELIVERED') {
                        completed++;
                    }
                });

                setStats({
                    todayOrders: todayOrd,
                    pendingOrders: pending,
                    completedOrders: completed,
                    todayRevenue: todayRev,
                    recentOrders: orders.slice(0, 5) // Last 5 orders
                });

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            }
        };

        fetchDashboardData();
        // Optional: Poll every 30s
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={containerVariants} initial="hidden" animate="show"
            className="text-gray-100"
        >
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white">Dashboard Overview</h1>
                    <p className="text-gray-400 mt-1">Real-time performance metrics</p>
                </div>
                <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-lg border border-amber-500/20 flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="font-bold text-sm tracking-widest uppercase">Live</span>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div variants={itemVariants} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-6xl text-white/5 group-hover:scale-110 transition-transform"><FaRupeeSign /></div>
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Today's Revenue</h2>
                    <p className="text-4xl font-black text-white">₹{stats.todayRevenue.toLocaleString()}</p>
                    <div className="mt-4 text-sm text-green-500 flex items-center gap-1"><FaChartLine /> +14% from yesterday</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-6xl text-white/5 group-hover:scale-110 transition-transform"><FaShoppingBag /></div>
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Today's Orders</h2>
                    <p className="text-4xl font-black text-white">{stats.todayOrders}</p>
                    <div className="mt-4 text-sm text-amber-500 flex items-center gap-1">Average ₹{Math.round(stats.todayRevenue / (stats.todayOrders || 1))} per order</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-6xl text-white/5 group-hover:scale-110 transition-transform"><FaClock /></div>
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Pending Orders</h2>
                    <p className="text-4xl font-black text-white">{stats.pendingOrders}</p>
                    <div className="mt-4 text-sm text-red-400 flex items-center gap-1">Requires immediate attention</div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-6xl text-white/5 group-hover:scale-110 transition-transform"><FaCheckCircle /></div>
                    <h2 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Completed</h2>
                    <p className="text-4xl font-black text-white">{stats.completedOrders}</p>
                    <div className="mt-4 text-sm text-gray-500 flex items-center gap-1">All time fulfilled</div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-zinc-900 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Revenue Trajectory</h2>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="time" stroke="#666" tick={{fill: '#666'}} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" tick={{fill: '#666'}} tickLine={false} axisLine={false} />
                                <Tooltip contentStyle={{backgroundColor: '#18181b', borderColor: '#ffffff10', borderRadius: '8px'}} itemStyle={{color: '#F59E0B'}} />
                                <Area type="monotone" dataKey="amount" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorAmt)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">Peak Hours</h2>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="time" stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#18181b', borderColor: '#ffffff10', borderRadius: '8px'}} />
                                <Bar dataKey="amount" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Orders Table */}
            <motion.div variants={itemVariants} className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Recent Incoming Orders</h2>
                    <button className="text-sm text-amber-500 hover:text-amber-400 font-bold">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">Order ID</th>
                                <th className="p-4 font-semibold">Customer</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {stats.recentOrders.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No recent orders found.</td></tr>
                            ) : (
                                stats.recentOrders.map(order => (
                                    <tr key={order._id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 font-mono text-amber-500">{order.orderId}</td>
                                        <td className="p-4 text-white font-medium">{order.customerName}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${
                                                ['DELIVERED', 'PAID', 'CONFIRMED'].includes(order.orderStatus) 
                                                ? 'bg-green-500/20 text-green-500' 
                                                : 'bg-amber-500/20 text-amber-500'
                                            }`}>
                                                {order.orderStatus.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-white">₹{order.totalAmount}</td>
                                        <td className="p-4 text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

        </motion.div>
    );
}
