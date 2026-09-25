const express = require('express');
const { createLocation, getLocations, getLocationById, updateLocation, deleteLocation } = require('../controllers/locationController');
const locationValidator = require('../validators/locationValidator');
const validate = require('../middleware/validationMiddleware');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect);
router.post('/', locationValidator, validate, createLocation);
router.get('/', getLocations);
router.get('/:id', getLocationById);
router.put('/:id', locationValidator, validate, updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;