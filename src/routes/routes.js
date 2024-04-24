const express = require('express');
const router = express.Router();
const { createShortURLController, getShortURLController } = require('../controllers/urlController');

router.post('/shorturl', createShortURLController);
router.get('/shorturl/:shorturl', getShortURLController);

module.exports = router;