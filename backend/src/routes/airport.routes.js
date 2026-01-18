const { Router } = require('express');
const { getAllAirports, getAirportById, createAirport, updateAirport, deleteAirport } = require('../controllers/airport.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

router.get('/', getAllAirports);
router.get('/:id', getAirportById);
router.post('/', authenticate, authorize('admin'), createAirport);
router.put('/:id', authenticate, authorize('admin'), updateAirport);
router.delete('/:id', authenticate, authorize('admin'), deleteAirport);

module.exports = router;
