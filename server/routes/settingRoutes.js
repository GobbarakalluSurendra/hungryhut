const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(getSettings)
    .put(protect, authorize('ADMIN'), updateSettings);

module.exports = router;
