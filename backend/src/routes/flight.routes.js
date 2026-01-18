const { Router } = require('express');
const { searchFlights, getFlightById, createFlight, updateFlight, deleteFlight } = require('../controllers/flight.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

router.get('/search', searchFlights);
router.get('/:id', getFlightById);
router.post('/', authenticate, authorize('admin'), createFlight);
router.put('/:id', authenticate, authorize('admin'), updateFlight);
router.delete('/:id', authenticate, authorize('admin'), deleteFlight);

module.exports = router;
