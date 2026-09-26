const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

// Initialize Razorpay
// Note: We use try/catch or conditional to avoid crashing if keys are missing during setup
let razorpay;
try {
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    }
} catch (error) {
    console.error("Razorpay initialization failed", error);
}

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Public
exports.createRazorpayOrder = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // MOCK PAYMENT FALLBACK: If user hasn't added Razorpay keys yet, let's fake it so they can test the app!
        if (!razorpay) {
            console.warn("Razorpay keys not found. Using Mock Payment flow.");
            const mockOrderId = `mock_order_${Date.now()}`;
            
            order.razorpayOrderId = mockOrderId;
            await order.save();

            return res.status(200).json({
                success: true,
                isMock: true, // Flag for the frontend
                data: {
                    id: mockOrderId,
                    amount: Math.round(order.totalAmount * 100),
                    currency: 'INR',
                    key: 'mock_key_123'
                }
            });
        }

        const options = {
            amount: Math.round(order.totalAmount * 100),
            currency: 'INR',
            receipt: order.orderId
        };

        const razorpayOrder = await razorpay.orders.create(options);

        // Save razorpayOrderId to our database
        order.razorpayOrderId = razorpayOrder.id;
        await order.save();

        res.status(200).json({
            success: true,
            isMock: false,
            data: {
                id: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify Razorpay Payment
// @route   POST /api/payments/verify
// @access  Public
exports.verifyPayment = async (req, res, next) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, isMock } = req.body;

        let isAuthentic = false;

        if (isMock) {
            // Bypass verification for mock payments
            isAuthentic = true;
        } else {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body.toString())
                .digest('hex');
            isAuthentic = expectedSignature === razorpay_signature;
        }

        if (isAuthentic) {
            // Find order and update status
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }

            order.paymentStatus = 'PAID';
            order.orderStatus = 'PAID';
            order.razorpayPaymentId = razorpay_payment_id;
            await order.save();

            // Notify Admins in real-time
            const io = req.app.get('io');
            if (io) {
                io.to('admin_room').emit('new_order', {
                    orderId: order.orderId,
                    customerName: order.customerName,
                    totalAmount: order.totalAmount,
                    message: `New paid order from ${order.customerName} for ₹${order.totalAmount}!`
                });
            }

            // WhatsApp Notification
            const { sendWhatsAppNotification } = require('../utils/whatsapp');
            await sendWhatsAppNotification({
                amount: order.totalAmount,
                itemsCount: order.items.length,
                paymentStatus: order.paymentStatus
            });

            res.status(200).json({ success: true, message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (err) {
        next(err);
    }
};
