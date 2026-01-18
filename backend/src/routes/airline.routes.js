const { Router } = require('express');
const { getAllAirlines, getAirlineById, createAirline, updateAirline, deleteAirline } = require('../controllers/airline.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

router.get('/', getAllAirlines);
router.get('/:id', getAirlineById);
router.post('/', authenticate, authorize('admin'), createAirline);
router.put('/:id', authenticate, authorize('admin'), updateAirline);
router.delete('/:id', authenticate, authorize('admin'), deleteAirline);

module.exports = router;
