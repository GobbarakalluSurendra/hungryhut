import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders');
            setOrders(res.data.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, field, value) => {
        try {
            await api.put(`/orders/${orderId}/status`, { [field]: value });
            fetchOrders();
        } catch (error) {
            console.error('Failed to update status', error);
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
                    <h1 className="text-4xl font-black tracking-tight text-white">Order Management</h1>
                    <p className="text-gray-400 mt-1">Track and update customer orders</p>
                </div>
                <button 
                    onClick={fetchOrders}
                    className="bg-zinc-900 border border-white/10 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                    Refresh Data
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-5 font-semibold border-b border-white/5">Order ID</th>
                                <th className="p-5 font-semibold border-b border-white/5">Customer</th>
                                <th className="p-5 font-semibold border-b border-white/5">Amount</th>
                                <th className="p-5 font-semibold border-b border-white/5">Payment Status</th>
                                <th className="p-5 font-semibold border-b border-white/5">Order Status</th>
                                <th className="p-5 font-semibold border-b border-white/5">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-5 whitespace-nowrap font-mono text-amber-500 font-bold">{order.orderId}</td>
                                    <td className="p-5 whitespace-nowrap">
                                        <div className="text-white font-bold">{order.customerName}</div>
                                        <div className="text-sm text-gray-500">{order.phone}</div>
                                    </td>
                                    <td className="p-5 whitespace-nowrap font-black text-white text-lg">₹{order.totalAmount}</td>
                                    <td className="p-5 whitespace-nowrap">
                                        <select 
                                            value={order.paymentStatus}
                                            onChange={(e) => handleStatusChange(order._id, 'paymentStatus', e.target.value)}
                                            className={`text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg border appearance-none cursor-pointer focus:outline-none transition-colors ${
                                                order.paymentStatus === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                                                order.paymentStatus === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}
                                        >
                                            <option value="PENDING" className="bg-zinc-900 text-amber-500">PENDING</option>
                                            <option value="PAID" className="bg-zinc-900 text-green-500">PAID</option>
                                            <option value="FAILED" className="bg-zinc-900 text-red-500">FAILED</option>
                                            <option value="REFUNDED" className="bg-zinc-900 text-gray-400">REFUNDED</option>
                                            <option value="CANCELLED" className="bg-zinc-900 text-gray-400">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className="p-5 whitespace-nowrap">
                                        <select 
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order._id, 'orderStatus', e.target.value)}
                                            className={`text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-lg border appearance-none cursor-pointer focus:outline-none transition-colors ${
                                                order.orderStatus === 'DELIVERED' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 
                                                ['PREPARING', 'READY', 'OUT_FOR_DELIVERY'].includes(order.orderStatus) ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                                                ['CANCELLED', 'PAYMENT_FAILED'].includes(order.orderStatus) ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-zinc-800 text-gray-300 border-white/10'
                                            }`}
                                        >
                                            <option value="PENDING_PAYMENT" className="bg-zinc-900 text-gray-300">PENDING PAYMENT</option>
                                            <option value="PAID" className="bg-zinc-900 text-green-500">PAID (NEW)</option>
                                            <option value="CONFIRMED" className="bg-zinc-900 text-purple-400">CONFIRMED</option>
                                            <option value="PREPARING" className="bg-zinc-900 text-purple-400">PREPARING</option>
                                            <option value="READY" className="bg-zinc-900 text-purple-400">READY</option>
                                            <option value="OUT_FOR_DELIVERY" className="bg-zinc-900 text-purple-400">OUT FOR DELIVERY</option>
                                            <option value="DELIVERED" className="bg-zinc-900 text-blue-500">DELIVERED</option>
                                            <option value="PAYMENT_FAILED" className="bg-zinc-900 text-red-500">PAYMENT FAILED</option>
                                            <option value="CANCELLED" className="bg-zinc-900 text-red-500">CANCELLED</option>
                                        </select>
                                    </td>
                                    <td className="p-5 whitespace-nowrap text-sm text-gray-400 font-medium">
                                        {new Date(order.createdAt).toLocaleString([], {
                                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                        })}
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
