const { Router } = require('express');
const authRoutes = require('./auth.routes');
const flightRoutes = require('./flight.routes');
const airportRoutes = require('./airport.routes');
const airlineRoutes = require('./airline.routes');
const bookingRoutes = require('./booking.routes');
const paymentRoutes = require('./payment.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/flights', flightRoutes);
router.use('/airports', airportRoutes);
router.use('/airlines', airlineRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;
