const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { addFavorite, getFavorites, removeFavorite } = require('../controllers/favoritesController');


router.get('/', verifyToken, getFavorites);


router.post('/', verifyToken, addFavorite);


router.delete('/:id', verifyToken, removeFavorite);

module.exports = router;
