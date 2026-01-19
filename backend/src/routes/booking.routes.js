const { Router } = require('express');
const { createBooking, getUserBookings, getBookingById, cancelBooking, getAllBookings } = require('../controllers/booking.controller');
const { createBookingRules } = require('../validators/booking.validator');
const { validate } = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

router.post('/', authenticate, createBookingRules, validate, createBooking);
router.get('/my', authenticate, getUserBookings);
router.get('/admin/all', authenticate, authorize('admin'), getAllBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/cancel', authenticate, cancelBooking);

module.exports = router;
