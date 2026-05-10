const express = require('express');
const router = express.Router();
const { updateProfile, changePassword } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../configs/multer');

router.put('/update', protect, upload.single('profileImage'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;
