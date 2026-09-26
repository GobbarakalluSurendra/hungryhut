const express = require('express');
const { getSettings, updateSettings } = require('../controllers/settingController');
const { protect, admin } = require('../middlewares/auth');

const router = express.Router();

router.route('/')
    .get(getSettings)
    .put(protect, admin, updateSettings);

module.exports = router;
