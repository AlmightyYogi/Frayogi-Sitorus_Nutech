const express = require('express');
const { getAllServices } = require('../controllers/serviceController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/services', verifyToken, getAllServices);

module.exports = router;
