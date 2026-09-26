import { useState, useEffect } from 'react';
import api from '../../api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
    const [deliveryFee, setDeliveryFee] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            if (res.data.success) {
                setDeliveryFee(res.data.data.deliveryFee);
            }
        } catch (err) {
            console.error('Failed to fetch settings');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/settings', { deliveryFee: Number(deliveryFee) });
            if (res.data.success) {
                toast.success('Settings updated successfully!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-4xl font-black text-white mb-8 tracking-tighter uppercase">Store Settings</h1>
            
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 max-w-xl">
                <form onSubmit={handleSave}>
                    <div className="mb-6">
                        <label className="block text-gray-400 font-medium mb-2 uppercase tracking-widest text-xs">Delivery Fee (₹)</label>
                        <input 
                            type="number" 
                            className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(e.target.value)}
                            min="0"
                            required
                        />
                        <p className="text-gray-500 text-xs mt-2">This fee is added to orders when the user selects "Delivery". Set to 0 for free delivery.</p>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-black font-bold py-3 px-8 rounded-xl transition-colors w-full uppercase tracking-widest"
                    >
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </form>
            </div>
        </div>
    );
}
