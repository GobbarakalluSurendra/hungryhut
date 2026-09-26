const Settings = require('../models/Settings');

// @desc    Get global settings (creates default if none exists)
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({ deliveryFee: 50 });
        }
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        next(err);
    }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
    try {
        let settings = await Settings.findOne();
        if (!settings) {
            settings = new Settings();
        }

        if (req.body.deliveryFee !== undefined) {
            settings.deliveryFee = req.body.deliveryFee;
        }

        await settings.save();
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        next(err);
    }
};
