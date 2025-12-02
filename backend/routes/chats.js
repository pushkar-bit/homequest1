const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createChat, getChat, postMessage, closeChat } = require('../controllers/chatsController');


router.post('/', verifyToken, createChat);


router.get('/:id', verifyToken, getChat);


router.post('/:id/messages', verifyToken, postMessage);


router.post('/:id/close', verifyToken, closeChat);

module.exports = router;
