const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order (Public)
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res, next) => {
    try {
        const { customerName, phone, address, landmark, orderType, paymentMethod, items } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        }

        // We MUST verify prices on the backend, never trust frontend prices
        let calculatedSubtotal = 0;
        let processedItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
            }
            if (!product.isAvailable) {
                return res.status(400).json({ success: false, message: `Product ${product.name} is currently unavailable` });
            }

            const itemSubtotal = product.price * item.quantity;
            calculatedSubtotal += itemSubtotal;

            processedItems.push({
                product: product._id,
                name: product.name,
                price: product.price, // Snapshot at time of order
                quantity: item.quantity,
                subtotal: itemSubtotal
            });
        }

        // Assume a static delivery fee for now as per MVP requirements
        const deliveryFee = orderType === 'DELIVERY' ? 50 : 0; // Example static fee
        const totalAmount = calculatedSubtotal + deliveryFee;

        const order = await Order.create({
            customerName,
            phone,
            address: orderType === 'DELIVERY' ? address : undefined,
            landmark,
            orderType,
            items: processedItems,
            subtotal: calculatedSubtotal,
            deliveryFee,
            totalAmount
        });

        // Notify Admins in real-time immediately for COD (since there is no payment verification step)
        if (paymentMethod === 'COD') {
            const io = req.app.get('io');
            if (io) {
                io.to('admin_room').emit('new_order', {
                    orderId: order.orderId,
                    customerName: order.customerName,
                    totalAmount: order.totalAmount,
                    message: `New COD order from ${order.customerName} for ₹${order.totalAmount}!`
                });
            }

            // WhatsApp Notification
            const { sendWhatsAppNotification } = require('../utils/whatsapp');
            await sendWhatsAppNotification({
                amount: order.totalAmount,
                itemsCount: order.items.length,
                paymentStatus: order.paymentStatus
            });
        }

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

// @desc    Get order by Custom ID (Public tracking)
// @route   GET /api/orders/:orderId
// @access  Public
exports.getOrder = async (req, res, next) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().sort('-createdAt');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        
        let updateData = {};
        if (orderStatus) updateData.orderStatus = orderStatus;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;

        const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};
