import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api';

export default function TrackOrder() {
    const [searchParams] = useSearchParams();
    const initialOrderId = searchParams.get('id') || '';
    
    const [orderId, setOrderId] = useState(initialOrderId);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialOrderId) {
            handleTrack(null, initialOrderId);
        }
    }, [initialOrderId]);

    const handleTrack = async (e, idToTrack = orderId) => {
        if (e) e.preventDefault();
        if (!idToTrack) return;
        
        setLoading(true);
        setError('');
        
        try {
            const res = await api.get(`/orders/${idToTrack}`);
            setOrder(res.data.data);
        } catch (err) {
            setError('Order not found. Please check the Order ID.');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const statusSteps = [
        'PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'
    ];
    
    const currentStepIndex = order ? statusSteps.indexOf(order.orderStatus) : -1;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-center">Track Your Order</h1>
            
            <form onSubmit={handleTrack} className="mb-12 flex max-w-md mx-auto">
                <input 
                    type="text" 
                    placeholder="Enter Order ID (e.g. HH2026...)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-l-md px-4 py-2 focus:ring-primary focus:border-primary"
                    required
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-6 py-2 rounded-r-md font-bold hover:bg-amber-600"
                >
                    Track
                </button>
            </form>

            {error && <div className="text-red-500 text-center mb-8">{error}</div>}

            {order && (
                <div className="bg-white rounded-lg shadow p-8">
                    <div className="mb-8 border-b pb-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Order #{order.orderId}</h2>
                            <p className="text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>

                    {/* Progress Tracker (Simplified) */}
                    <div className="mb-10">
                        <h3 className="font-bold text-lg mb-4">Status</h3>
                        <div className="space-y-4">
                            {statusSteps.map((status, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                
                                return (
                                    <div key={status} className={`flex items-center ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'border-primary bg-amber-50' : 'border-gray-300'} ${isCurrent ? 'bg-primary text-white' : ''}`}>
                                            {isCompleted && !isCurrent ? '✓' : index + 1}
                                        </div>
                                        <span className={`ml-4 font-medium ${isCurrent ? 'font-bold' : ''}`}>
                                            {status.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">Order Details</h3>
                        <div className="divide-y divide-gray-100">
                            {order.items.map(item => (
                                <div key={item._id} className="py-2 flex justify-between">
                                    <span>{item.quantity} x {item.name}</span>
                                    <span>₹{item.subtotal}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Paid</span>
                                <span>₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
