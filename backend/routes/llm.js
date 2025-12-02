const express = require('express');
const router = express.Router();
const { propertyChat } = require('../controllers/llmController');


router.post('/property-chat', propertyChat);

module.exports = router;
