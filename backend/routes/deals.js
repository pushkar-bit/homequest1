const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { getDeals, createDeal, getOffers, createOffer } = require('../controllers/dealsController');


router.get('/offers', getOffers);
router.post('/offers', createOffer);


router.get('/', verifyToken, getDeals);
router.post('/', verifyToken, createDeal);

module.exports = router;
