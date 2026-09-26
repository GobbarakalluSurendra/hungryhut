import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import CustomerLayout from './layouts/CustomerLayout';
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import TrackOrder from './pages/customer/TrackOrder';
import Reviews from './pages/customer/Reviews';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReviews from './pages/admin/AdminReviews';
import AdminSettings from './pages/admin/AdminSettings';

// A wrapper component for page transitions
const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full h-full"
    >
        {children}
    </motion.div>
);

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background text-gray-900">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Customer Routes */}
          <Route path="/" element={<CustomerLayout />}>
              <Route index element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="menu" element={<PageWrapper><Menu /></PageWrapper>} />
              <Route path="reviews" element={<PageWrapper><Reviews /></PageWrapper>} />
              <Route path="cart" element={<PageWrapper><Cart /></PageWrapper>} />
              <Route path="checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
              <Route path="track-order" element={<PageWrapper><TrackOrder /></PageWrapper>} />
          </Route>
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
