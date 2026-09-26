import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ customerName: '', rating: 5, comment: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get('/reviews');
                setReviews(res.data.data);
            } catch (err) {
                console.error('Failed to load reviews');
            }
        };
        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/reviews', formData);
            toast.success('Review submitted! It will appear once approved by the admin.', { duration: 5000 });
            setShowModal(false);
            setFormData({ customerName: '', rating: 5, comment: '' });
        } catch (err) {
            toast.error('Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-28 pb-32">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
                            className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter"
                        >
                            The <span className="text-primary">Verdict</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                            className="text-gray-400 text-xl mt-4 max-w-2xl"
                        >
                            Don't just take our word for it. Read what our elite patrons have to say about the HungryHut experience.
                        </motion.p>
                    </div>
                    <motion.button 
                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                        onClick={() => setShowModal(true)}
                        className="bg-primary text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-amber-400 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.3)] whitespace-nowrap"
                    >
                        Leave a Review
                    </motion.button>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-32 border border-white/5 rounded-3xl bg-zinc-900/50">
                        <p className="text-gray-500 text-2xl font-light">Be the first to leave a review!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, i) => (
                            <motion.div 
                                key={review._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-zinc-900/80 border border-white/5 rounded-3xl p-8 hover:border-primary/30 transition-colors shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
                                <div className="flex gap-1 mb-6 text-primary text-xl">
                                    {[...Array(5)].map((_, idx) => (
                                        <FaStar key={idx} className={idx < review.rating ? "text-primary" : "text-white/10"} />
                                    ))}
                                </div>
                                <p className="text-gray-300 text-lg font-light leading-relaxed mb-8 italic">"{review.comment}"</p>
                                <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                                    <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-primary font-black text-xl border border-white/5">
                                        {review.customerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{review.customerName}</h4>
                                        <p className="text-gray-500 text-sm uppercase tracking-wider">Verified Patron</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-[0_0_50px_rgba(245,158,11,0.15)]"
                        >
                            <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Share Your Experience</h3>
                            <p className="text-gray-400 mb-8 font-light">Your feedback helps us achieve culinary perfection.</p>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Your Name</label>
                                    <input 
                                        type="text" required 
                                        value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                        placeholder="John Doe"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Rating</label>
                                    <div className="flex gap-2">
                                        {[1,2,3,4,5].map(num => (
                                            <button 
                                                key={num} type="button"
                                                onClick={() => setFormData({...formData, rating: num})}
                                                className="text-3xl focus:outline-none hover:scale-110 transition-transform"
                                            >
                                                <FaStar className={num <= formData.rating ? "text-primary drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "text-white/10"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Your Review</label>
                                    <textarea 
                                        required 
                                        value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}
                                        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-32"
                                        placeholder="The food was absolutely incredible..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="submit" disabled={loading}
                                        className="flex-1 bg-primary text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Review'}
                                    </button>
                                    <button 
                                        type="button" onClick={() => setShowModal(false)}
                                        className="px-6 bg-transparent border border-white/20 text-white font-bold uppercase tracking-wider rounded-xl hover:bg-white/5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
