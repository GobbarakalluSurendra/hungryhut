const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        unique: true
    },
    customerName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: function() { return this.orderType === 'DELIVERY'; }
    },
    landmark: {
        type: String
    },
    orderType: {
        type: String,
        enum: ['DELIVERY', 'PICKUP'],
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        subtotal: {
            type: Number,
            required: true
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    deliveryFee: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED', 'CANCELLED'],
        default: 'PENDING'
    },
    orderStatus: {
        type: String,
        enum: ['PENDING_PAYMENT', 'PAID', 'CONFIRMED', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED', 'PAYMENT_FAILED', 'CANCELLED'],
        default: 'PENDING_PAYMENT'
    },
    razorpayOrderId: {
        type: String
    },
    razorpayPaymentId: {
        type: String
    }
}, { timestamps: true });

// Generate friendly order ID before saving
orderSchema.pre('save', function() {
    if (!this.orderId) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        this.orderId = `HH${year}${month}${day}${randomNum}`;
    }
});

module.exports = mongoose.model('Order', orderSchema);
