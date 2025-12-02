const express = require('express');
const router = express.Router();
const {
    getProperties,
    getPropertyById,
    getTrendingProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    getDeletedProperties,
    recoverProperty,
} = require('../controllers/propertiesController');
const { verifyToken } = require('../middleware/auth');


const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Access denied. Admin only.' });
    }
};


router.get('/', getProperties);
router.get('/trending', getTrendingProperties);
router.get('/:id', getPropertyById);


router.get('/deleted/all', verifyToken, checkAdmin, getDeletedProperties);
router.post('/:id/recover', verifyToken, checkAdmin, recoverProperty);


router.post('/', verifyToken, createProperty);
router.put('/:id', verifyToken, updateProperty);
router.delete('/:id', verifyToken, deleteProperty);

module.exports = router;
