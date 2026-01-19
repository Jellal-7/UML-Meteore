const { Router } = require('express');
const { processPayment, getPaymentByBooking } = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.post('/:bookingId/pay', authenticate, processPayment);
router.get('/:bookingId', authenticate, getPaymentByBooking);

module.exports = router;
