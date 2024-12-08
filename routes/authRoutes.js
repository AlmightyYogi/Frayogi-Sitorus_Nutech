const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Module Membership
router.post('/registration', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile/update', authMiddleware, authController.updateProfile);
router.put('/profile/image', authMiddleware, upload.single('profile_image'), authController.updateProfileImage);

module.exports = router;
