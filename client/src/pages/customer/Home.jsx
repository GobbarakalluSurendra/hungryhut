import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
const FloatingFoodBackground = () => {
    const foodItems = ["🍗", "🥘", "🍛", "🥗", "🍲", "🍤", "🍖", "🌶️", "🍋", "🍅", "🧅", "🍕", "🍔"];
    
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {foodItems.map((item, i) => {
                // Determine deterministic pseudo-random values based on index to prevent hydration mismatch and ensure stable animations
                const random = (seed) => {
                    const x = Math.sin(seed++) * 10000;
                    return x - Math.floor(x);
                };
                
                const initialX = random(i) * 100; 
                const initialY = random(i + 10) * 100;
                const moveX = (random(i + 20) - 0.5) * 40;
                const moveY = (random(i + 30) - 0.5) * 40;
                const duration = 25 + random(i + 40) * 20;
                const size = 30 + random(i + 50) * 50;
                const opacity = 0.05 + random(i + 60) * 0.1;
                
                return (
                    <motion.div
                        key={i}
                        initial={{ 
                            x: `${initialX}vw`, 
                            y: `${initialY}vh`, 
                            rotate: 0, 
                            opacity: 0 
                        }}
                        animate={{ 
                            x: [`${initialX}vw`, `${initialX + moveX}vw`, `${initialX}vw`],
                            y: [`${initialY}vh`, `${initialY + moveY}vh`, `${initialY}vh`],
                            rotate: [0, 360],
                            opacity: [opacity, opacity * 1.5, opacity]
                        }}
                        transition={{ 
                            duration: duration, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                        className="absolute grayscale mix-blend-screen"
                        style={{ fontSize: `${size}px` }}
                    >
                        {item}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default function Home() {
    const { scrollYProgress } = useScroll();
    const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    
    // Mouse hover effect state
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="overflow-hidden bg-black text-white relative w-full font-sans selection:bg-primary selection:text-black">
            <FloatingFoodBackground />
            {/* Custom Interactive Glow Cursor */}
            <motion.div 
                animate={{ x: mousePosition.x - 200, y: mousePosition.y - 200 }}
                transition={{ type: "spring", stiffness: 100, damping: 25, mass: 0.1 }}
                className="fixed top-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-50 mix-blend-screen"
            />
            
            <motion.div 
                animate={{ x: mousePosition.x - 100, y: mousePosition.y - 100 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, mass: 0.05 }}
                className="fixed top-0 left-0 w-[200px] h-[200px] bg-amber-500/10 rounded-full blur-[60px] pointer-events-none z-50 mix-blend-screen"
            />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Hero Video Background */}
                <div className="absolute inset-0 w-full h-full z-0 perspective-1000">
                    <motion.video 
                        style={{ y: useTransform(scrollYProgress, [0, 1], [0, 500]), scale: useTransform(scrollYProgress, [0, 1], [1, 1.2]) }}
                        autoPlay loop muted playsInline
                        className="w-full h-full object-cover opacity-60"
                    >
                        {/* High quality cinematic food video */}
                        <source src="https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-pizza-with-cheese-and-tomatoes-42861-large.mp4" type="video/mp4" />
                    </motion.video>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black z-10"></div>
                </div>

                <motion.div 
                    style={{ y: y1, opacity: opacityHero }}
                    className="relative z-20 text-center max-w-6xl mx-auto px-4 flex flex-col items-center pt-20"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        transition={{ duration: 1.5, type: "spring", bounce: 0.5 }}
                        className="mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-primary blur-3xl opacity-40 rounded-full animate-pulse"></div>
                        <span className="relative inline-block py-2 px-8 rounded-full border border-primary/40 bg-black/60 backdrop-blur-xl text-primary font-bold tracking-[0.3em] text-xs uppercase shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            SPICE. FIRE. FLAVOR.
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ y: 100, opacity: 0, filter: "blur(20px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tighter uppercase"
                    >
                        WELCOME TO THE <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-amber-400 to-orange-600 filter drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                            HUNGRY HUT
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1.2, delay: 0.6 }}
                        className="text-lg md:text-2xl lg:text-3xl text-gray-300 mb-10 max-w-3xl font-light tracking-wide mx-auto lg:mx-0"
                    >
                        Slow-cooked dum biryanis, fiery starters, and rich curries. Experience the true taste of India in every single bite.
                    </motion.p>

                    <motion.div 
                        initial={{ y: 50, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.8, type: "spring" }}
                        className="flex flex-col sm:flex-row gap-8"
                    >
                        <Link to="/menu">
                            <motion.button 
                                whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(245, 158, 11, 0.8)" }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative px-12 py-6 bg-gradient-to-r from-primary via-orange-500 to-red-600 rounded-full font-black text-xl overflow-hidden transition-all uppercase tracking-wider"
                            >
                                <span className="relative z-10 text-black">Explore The Menu</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Animated Scroll Indicator */}
                <motion.div 
                    animate={{ y: [0, 20, 0], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20"
                >
                    <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold">Scroll Down</span>
                    <div className="w-[2px] h-16 bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
                </motion.div>
            </section>

            {/* Infinite Marquee Section */}
            <div className="py-6 bg-primary overflow-hidden flex whitespace-nowrap border-y border-amber-400/30">
                <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="flex space-x-12 items-center w-max"
                >
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-12">
                            {[
                                "Paneer Tikka", "Chicken 65", "Butter Chicken", "Veg Dum Biryani", 
                                "Mushroom Biryani", "Ghee Fried Rice", "Chicken Fried Rice", 
                                "Chicken Roast Biryani", "Paneer 65", "Paneer Butter Masala", 
                                "Chicken Roast", "Chilli Chicken", "Lollipop Chicken", "Paneer Biryani"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center space-x-12">
                                    <span className="text-4xl font-black text-black uppercase tracking-tighter">{item}</span>
                                    <span className="text-2xl text-black/50">✦</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Heavy Parallax Feature Section */}
            <section className="relative py-40 bg-black overflow-hidden border-t border-white/5">
                {/* Background ambient glow */}
                <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-24">
                        <div className="lg:w-1/2 relative perspective-[2000px]">
                            {/* Floating decorative elements */}
                            <motion.div 
                                animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -top-12 -left-12 w-32 h-32 bg-gradient-to-br from-primary to-orange-600 rounded-full blur-2xl opacity-40 z-0"
                            ></motion.div>

                            <motion.div 
                                initial={{ rotateX: 30, rotateY: -30, opacity: 0, scale: 0.7 }}
                                whileInView={{ rotateX: 0, rotateY: 0, opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-200px" }}
                                transition={{ duration: 1.8, type: "spring", bounce: 0.3 }}
                                whileHover={{ rotateX: 5, rotateY: -5, scale: 1.02 }}
                                className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_120px_rgba(245,158,11,0.2)] bg-zinc-900 z-10"
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <img 
                                    src="/menu-images/spicy_dum_biryani_1.jpg" 
                                    alt="Spicy Dum Biryani" 
                                    className="w-full h-[600px] object-cover hover:scale-110 transition-transform duration-1000" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                                
                                <motion.div 
                                    className="absolute bottom-12 left-12 right-12"
                                    initial={{ y: 50, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8, duration: 1 }}
                                >
                                    <div className="w-16 h-1 bg-primary mb-6"></div>
                                    <h3 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">Art on a Plate</h3>
                                    <p className="text-xl text-gray-400 font-light">Meticulously crafted by world-renowned culinary masters.</p>
                                </motion.div>
                            </motion.div>
                        </div>
                        
                        <div className="lg:w-1/2">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.3 } }
                                }}
                            >
                                <motion.h2 
                                    variants={{ hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } }}
                                    className="text-5xl md:text-8xl font-black mb-10 leading-[0.9] uppercase tracking-tighter"
                                >
                                    The <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-orange-500">
                                        Standard
                                    </span>
                                </motion.h2>
                                
                                <motion.p 
                                    variants={{ hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } }}
                                    className="text-2xl text-gray-400 mb-16 font-light leading-relaxed border-l-2 border-primary pl-6"
                                >
                                    We don't just serve food, we share our heritage. Every dish is crafted with authentic spices, traditional recipes, and absolute passion.
                                </motion.p>

                                <div className="space-y-12">
                                    {[
                                        { title: "Authentic Spices", desc: "Hand-ground masalas and spices sourced directly from local farms for that perfect, unforgettable aroma." },
                                        { title: "Traditional Cooking", desc: "Slow-cooked dum biryanis and smoky flavors that capture the true essence of Indian cuisine." },
                                        { title: "Fresh Ingredients", desc: "Premium quality meats and fresh vegetables prepared daily to ensure the highest standard of taste." }
                                    ].map((item, index) => (
                                        <motion.div 
                                            key={index}
                                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
                                            className="flex gap-8 items-start group cursor-crosshair"
                                        >
                                            <div className="w-20 h-20 rounded-3xl bg-black border border-white/10 shadow-[0_0_30px_rgba(0,0,0,1)] flex items-center justify-center text-primary font-black text-3xl group-hover:bg-primary group-hover:text-black group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0">
                                                0{index + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h4>
                                                <p className="text-lg text-gray-400 font-light">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
            

            
            {/* Scrolling Menu Images Section */}
            <section className="py-20 bg-zinc-950 border-t border-white/10 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950 z-10 pointer-events-none w-full"></div>
                <div className="text-center mb-12">
                    <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        Taste <span className="text-primary">The Magic</span>
                    </h3>
                </div>
                
                <div className="flex whitespace-nowrap w-[200%]">
                    <motion.div 
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                        className="flex space-x-6 items-center w-full"
                    >
                        {/* Duplicate the array to create a seamless loop */}
                        {[
                            'Butter chicken.jpg', 'Chicken 65.jpg', 'Chicken Fried Rice.jpg', 
                            'Chicken Roast Biryani.jpg', 'Chicken Roast.jpg', 
                            'Chilli Chicken.jpg', 'Ghee Fried Rice.jpg', 'Lollipop Chicken.jpg', 
                            'Mushroom Biryani.jpg', 'Paneer 65.jpg', 'Paneer Butter Masala.jpg', 
                            'Paneer Tikka.jpg', 'paneer_biryani.jpg', 'Spicy dum biryani.jpg', 'Veg Dum Biryani.jpg',
                            
                            'Butter chicken.jpg', 'Chicken 65.jpg', 'Chicken Fried Rice.jpg', 
                            'Chicken Roast Biryani.jpg', 'Chicken Roast.jpg', 
                            'Chilli Chicken.jpg', 'Ghee Fried Rice.jpg', 'Lollipop Chicken.jpg', 
                            'Mushroom Biryani.jpg', 'Paneer 65.jpg', 'Paneer Butter Masala.jpg', 
                            'Paneer Tikka.jpg', 'paneer_biryani.jpg', 'Spicy dum biryani.jpg', 'Veg Dum Biryani.jpg'
                        ].map((img, i) => (
                            <div key={i} className="inline-block relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden shrink-0 group border border-white/5 shadow-2xl">
                                <img 
                                    src={`/menu-images/${encodeURIComponent(img)}`} 
                                    alt={img} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Link to="/menu">
                                        <button className="px-6 py-2 bg-primary text-black font-black uppercase tracking-widest rounded-full scale-90 group-hover:scale-100 transition-transform duration-300">
                                            Order Now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
