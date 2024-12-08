const express = require('express');
const { getAllBanners } = require('../controllers/bannerController');
const router = express.Router();

router.get('/banner', getAllBanners);

module.exports = router;
