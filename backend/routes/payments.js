const express = require('express');
const router = express.Router();
const { createBankTransfer } = require('../controllers/paymentsController');


router.post('/transfer', createBankTransfer);

module.exports = router;
