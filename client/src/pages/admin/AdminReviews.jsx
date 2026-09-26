import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaStar, FaTrash } from 'react-icons/fa';
import api from '../../api';
import toast from 'react-hot-toast';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/reviews/all');
            setReviews(res.data.data);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleApproval = async (id, currentStatus) => {
        try {
            await api.put(`/reviews/${id}/approve`);
            toast.success(currentStatus ? 'Review hidden from website' : 'Review approved and published!');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
        try {
            await api.delete(`/reviews/${id}`);
            toast.success('Review deleted');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? 'text-amber-500' : 'text-zinc-700'} />
        ));
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
                    <h1 className="text-4xl font-black tracking-tight text-white">Customer Reviews</h1>
                    <p className="text-gray-400 mt-1">Approve testimonials to display them on the homepage.</p>
                </div>
                <button 
                    onClick={fetchReviews}
                    className="bg-zinc-900 border border-white/10 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-xl hover:bg-white/5 transition-colors"
                >
                    Refresh
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-black/50 text-gray-400 text-sm uppercase tracking-wider">
                                <th className="p-5 font-semibold border-b border-white/5">Customer</th>
                                <th className="p-5 font-semibold border-b border-white/5">Rating</th>
                                <th className="p-5 font-semibold border-b border-white/5">Comment</th>
                                <th className="p-5 font-semibold border-b border-white/5 text-center">Published</th>
                                <th className="p-5 font-semibold border-b border-white/5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {reviews.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No reviews found.</td></tr>
                            ) : (
                                reviews.map(review => (
                                    <tr key={review._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5 whitespace-nowrap text-white font-bold">{review.customerName}</td>
                                        <td className="p-5 whitespace-nowrap">
                                            <div className="flex gap-1">{renderStars(review.rating)}</div>
                                        </td>
                                        <td className="p-5 text-gray-300 max-w-md truncate">"{review.comment}"</td>
                                        <td className="p-5 whitespace-nowrap text-center">
                                            {review.isApproved ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-500 rounded font-bold text-xs uppercase tracking-widest">
                                                    <FaCheckCircle /> Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-zinc-800 text-gray-400 rounded font-bold text-xs uppercase tracking-widest">
                                                    <FaTimesCircle /> No
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-5 whitespace-nowrap text-right space-x-3">
                                            <button 
                                                onClick={() => toggleApproval(review._id, review.isApproved)} 
                                                className={`font-bold transition-colors ${review.isApproved ? 'text-amber-500 hover:text-amber-400' : 'text-green-500 hover:text-green-400'}`}
                                            >
                                                {review.isApproved ? 'Unpublish' : 'Approve'}
                                            </button>
                                            <button 
                                                onClick={() => deleteReview(review._id)} 
                                                className="text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
}
