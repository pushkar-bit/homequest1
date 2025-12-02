const express = require('express');
const router = express.Router();
const {
    listCities,
    getCityInsights,
    getLocalityInsights,
    getSocietyInsights,
    createCityInsight,
    updateCityInsight,
    deleteCityInsight,
    createLocalityInsight,
    updateLocalityInsight,
    deleteLocalityInsight,
    getInsightHistory,
    undoInsightChange,
} = require('../controllers/insightsController');
const { verifyToken } = require('../middleware/auth');


const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Access denied. Admin only.' });
    }
};


router.get('/cities', listCities);
router.get('/city', getCityInsights);
router.get('/locality', getLocalityInsights);
router.get('/society', getSocietyInsights);


router.post('/city', verifyToken, checkAdmin, createCityInsight);
router.put('/city/:id', verifyToken, checkAdmin, updateCityInsight);
router.delete('/city/:id', verifyToken, checkAdmin, deleteCityInsight);


router.post('/locality', verifyToken, checkAdmin, createLocalityInsight);
router.put('/locality/:id', verifyToken, checkAdmin, updateLocalityInsight);
router.delete('/locality/:id', verifyToken, checkAdmin, deleteLocalityInsight);


router.get('/:type/:id/history', verifyToken, checkAdmin, getInsightHistory);
router.post('/:type/:id/undo', verifyToken, checkAdmin, undoInsightChange);

module.exports = router;
