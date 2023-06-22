const express = require('express');
const router = express.Router();

// Import controllers
const userController = require('../controllers/userController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);
router.get('/activate-account/:token', userController.activateAccount);

module.exports = router;
