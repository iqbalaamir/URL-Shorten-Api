const express = require('express');
const userRoutes = require('./userRoutes');
const urlRoutes = require('./urlRoutes');

const router = express.Router();

router.use('/user', userRoutes);
router.use('/url', urlRoutes);

module.exports = router;
