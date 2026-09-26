import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../context/cartStore';
import api from '../../api';

export default function Checkout() {
    const { items, getCartTotal, clearCart } = useCartStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showMockPaymentModal, setShowMockPaymentModal] = useState(false);
    const [mockOrderDetails, setMockOrderDetails] = useState(null);
    const [mockPaymentProcessing, setMockPaymentProcessing] = useState(false);
    
    const [showUpiModal, setShowUpiModal] = useState(false);
    const [upiOrderRef, setUpiOrderRef] = useState(null);
    
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        address: '',
        landmark: '',
        orderType: 'DELIVERY',
        paymentMethod: 'ONLINE'
    });

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    const subtotal = getCartTotal();
    const deliveryFee = formData.orderType === 'DELIVERY' ? 50 : 0;
    const totalAmount = subtotal + deliveryFee;

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // 1. Create order in DB
            const orderPayload = {
                ...formData,
                items: items.map(i => ({ product: i.product._id, quantity: i.quantity }))
            };
            
            const orderRes = await api.post('/orders', orderPayload);
            const order = orderRes.data.data;

            // If Cash on Delivery, just complete the checkout!
            if (formData.paymentMethod === 'COD') {
                clearCart();
                navigate(`/track-order?id=${order.orderId}`);
                return;
            }

            // 3. Create Razorpay order
            const rzpOrderRes = await api.post('/payments/create-order', { orderId: order._id });
            const { data: rzpOrder, isMock } = rzpOrderRes.data;

            // 3.5 Check for mock flow
            if (isMock) {
                setMockOrderDetails({ rzpOrder, order });
                setShowMockPaymentModal(true);
                setLoading(false);
                return;
            }

            // 4. Load Razorpay script (Only for real flow)
            const res = await loadRazorpay();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // 5. Open Razorpay Checkout
            const options = {
                key: rzpOrder.key,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                name: "HungryHut",
                description: "Food Order",
                order_id: rzpOrder.id,
                handler: async function (response) {
                    try {
                        // 6. Verify payment
                        const verifyRes = await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: order._id
                        });

                        if (verifyRes.data.success) {
                            clearCart();
                            navigate(`/track-order?id=${order.orderId}`);
                        }
                    } catch (error) {
                        alert('Payment verification failed!');
                        console.error(error);
                    }
                },
                prefill: {
                    name: formData.customerName,
                    contact: formData.phone
                },
                theme: {
                    color: "#F59E0B"
                },
                config: {
                    display: {
                        blocks: {
                            upi_block: {
                                name: "Pay via UPI",
                                instruments: [
                                    { method: "upi" }
                                ]
                            },
                            other_block: {
                                name: "Other Payment Modes",
                                instruments: [
                                    { method: "card" },
                                    { method: "netbanking" },
                                    { method: "wallet" }
                                ]
                            }
                        },
                        sequence: ["block.upi_block", "block.other_block"],
                        preferences: {
                            show_default_blocks: true
                        }
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response) {
                alert('Payment Failed! ' + response.error.description);
            });
            paymentObject.open();

        } catch (error) {
            console.error('Checkout error', error);
            alert('Something went wrong during checkout.');
            setLoading(false);
        }
    };

    const handleMockPayment = async (status) => {
        if (status === 'fail') {
            alert('Payment failed by user simulation.');
            setShowMockPaymentModal(false);
            return;
        }

        setMockPaymentProcessing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate bank delay
            const { rzpOrder, order } = mockOrderDetails;
            
            const verifyRes = await api.post('/payments/verify', {
                razorpay_order_id: rzpOrder.id,
                razorpay_payment_id: 'mock_payment_' + Date.now(),
                razorpay_signature: 'mock_signature',
                orderId: order._id,
                isMock: true
            });

            if (verifyRes.data.success) {
                setShowMockPaymentModal(false);
                clearCart();
                navigate(`/track-order?id=${order.orderId}`);
            }
        } catch (error) {
            alert('Mock payment verification failed!');
            console.error(error);
        } finally {
            setMockPaymentProcessing(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
                <div className="bg-white rounded-lg shadow p-8">
                    <h2 className="text-2xl font-bold mb-6">Checkout Details</h2>
                    <form onSubmit={handleCheckout} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input 
                                    type="text" required 
                                    value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input 
                                    type="tel" required 
                                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Order Type</label>
                                <select 
                                    value={formData.orderType} onChange={e => setFormData({...formData, orderType: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                                >
                                    <option value="DELIVERY">Delivery</option>
                                    <option value="PICKUP">Pickup</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                                <select 
                                    value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                                >
                                    <option value="ONLINE">Online Payment (Razorpay)</option>
                                    <option value="COD">Cash on Delivery</option>
                                </select>
                            </div>
                        </div>

                        {formData.orderType === 'DELIVERY' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
                                    <textarea 
                                        required 
                                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Landmark (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary focus:border-primary"
                                    />
                                </div>
                            </>
                        )}
                        
                            <button 
                                type="submit" disabled={loading}
                                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-amber-600 disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : (formData.paymentMethod === 'COD' ? `Place Order • ₹${totalAmount}` : `Pay ₹${totalAmount}`)}
                            </button>
                    </form>
                </div>
            </div>

            <div className="md:w-1/3">
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="divide-y divide-gray-200 mb-4">
                        {items.map(item => (
                            <div key={item.product._id} className="py-3 flex justify-between">
                                <div>
                                    <span className="text-gray-800">{item.product.name}</span>
                                    <span className="text-gray-500 text-sm ml-2">x {item.quantity}</span>
                                </div>
                                <span className="font-medium">₹{item.product.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mb-2 text-gray-600">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-gray-600">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryFee}</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span>₹{totalAmount}</span>
                    </div>
                </div>
            </div>

            {/* Simulated Payment Gateway Modal */}
            {showMockPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-zinc-900 text-white rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(245,158,11,0.2)] border border-white/10">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-black text-primary uppercase tracking-wider mb-2">Simulated Gateway</h3>
                            <p className="text-gray-400 text-sm">Testing Mode Active (No real charge)</p>
                        </div>
                        
                        <div className="bg-black rounded-xl p-6 mb-8 border border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Merchant</span>
                                <span className="font-bold">HungryHut</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-400">Order ID</span>
                                <span className="font-mono text-sm">{mockOrderDetails?.rzpOrder.id}</span>
                            </div>
                            <div className="flex justify-between items-center text-xl border-t border-white/10 pt-4 mt-2">
                                <span className="text-gray-300">Amount to Pay</span>
                                <span className="font-black text-amber-500">₹{totalAmount}</span>
                            </div>
                        </div>

                        {mockPaymentProcessing ? (
                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                                <p className="text-primary font-bold animate-pulse">Processing Payment...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <button 
                                    onClick={() => handleMockPayment('success')}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black text-lg uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(22,163,74,0.4)]"
                                >
                                    Simulate Success
                                </button>
                                <button 
                                    onClick={() => handleMockPayment('fail')}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-bold uppercase tracking-wide transition-colors"
                                >
                                    Simulate Failure
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
