const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    deliveryFee: { type: Number, default: 50 }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
