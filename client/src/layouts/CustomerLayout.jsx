import { Outlet } from 'react-router-dom';
import Navbar from '../components/customer/Navbar';

export default function CustomerLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-background text-gray-900 font-sans">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-black text-white py-16 border-t border-white/10 mt-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                        
                        {/* Brand Column */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="/logo.png" alt="HungryHut Logo" className="w-12 h-12 object-contain" />
                                <span className="text-2xl font-black text-white tracking-widest uppercase">
                                    Hungry<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">Hut</span>
                                </span>
                            </div>
                            <p className="text-gray-400 font-light leading-relaxed max-w-xs">
                                Redefining gastronomy through art, fire, and passion. Experience the ultimate culinary journey.
                            </p>
                        </div>

                        {/* Contact & Location */}
                        <div className="flex flex-col items-center md:items-start">
                            <h4 className="text-lg font-black uppercase tracking-widest mb-6 text-primary">Contact & Location</h4>
                            <ul className="space-y-4 text-gray-400 font-light">
                                <li className="flex items-start gap-3 justify-center md:justify-start">
                                    <span className="text-xl">📍</span>
                                    <span className="leading-snug">
                                        NANDYAL ROUTE, near Krr School,<br />
                                        Panyam, Andhra Pradesh 518112
                                    </span>
                                </li>
                                <li className="flex items-center gap-3 justify-center md:justify-start mt-4">
                                    <span className="text-xl">📞</span>
                                    <a href="tel:8555938190" className="hover:text-primary transition-colors">8555938190</a>
                                </li>
                                <li className="flex items-center gap-3 justify-center md:justify-start mt-2">
                                    <span className="text-xl">📞</span>
                                    <a href="tel:6304454153" className="hover:text-primary transition-colors">6304454153</a>
                                </li>
                            </ul>
                        </div>

                        {/* Socials */}
                        <div className="flex flex-col items-center md:items-start">
                            <h4 className="text-lg font-black uppercase tracking-widest mb-6 text-primary">Follow Us</h4>
                            <p className="text-gray-400 font-light mb-6">Stay updated with our latest cinematic flavors and exclusive offers.</p>
                            <a 
                                href="https://www.instagram.com/hungryhut2023?igshid=MjEwN2IyYWYwYw%3D%3D" 
                                target="_blank" 
                                rel="noreferrer"
                                className="group flex items-center gap-3 bg-gradient-to-tr from-pink-600 via-purple-600 to-orange-500 px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(219,39,119,0.3)]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                                <span className="font-bold text-white tracking-widest uppercase text-sm">Instagram</span>
                            </a>
                        </div>
                    </div>

                    <div className="border-t border-white/10 mt-16 pt-8 text-center text-gray-500 text-sm font-light uppercase tracking-wider">
                        <p>&copy; 2026 HungryHut. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
