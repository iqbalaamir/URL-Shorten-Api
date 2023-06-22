const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Import controllers
const urlController = require('../controllers/urlController');

router.get('/url/:shortURL', urlController.redirectToURL);
router.post('/shorten', auth, urlController.shortenURL);
router.get('/urls', auth, urlController.getAllUrls);
module.exports = router;
