const { Booking, Payment, Flight, Airline, Airport, Passenger } = require('../models');

const processPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const { card_number, card_expiry, card_cvv, card_holder } = req.body;

    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Flight }],
    });

    if (!booking) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    if (booking.status === 'confirmed') {
      return res.status(400).json({ error: 'Cette réservation est déjà confirmée' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Cette réservation a été annulée' });
    }

    const existingPayment = await Payment.findOne({
      where: { booking_id: bookingId, status: 'completed' },
    });

    if (existingPayment) {
      return res.status(400).json({ error: 'Un paiement a déjà été effectué pour cette réservation' });
    }

    // Simulation de paiement — validation de format uniquement
    if (!card_number || !card_expiry || !card_cvv || !card_holder) {
      return res.status(422).json({ error: 'Informations de carte incomplètes' });
    }

    // Liste noire de test : numéro de carte refusé
    const blacklistedCards = ['4000000000000002', '5100000000000002'];
    const cleanCardNumber = card_number.replace(/\s/g, '');
    if (blacklistedCards.includes(cleanCardNumber)) {
      const failedPayment = await Payment.create({
        booking_id: bookingId,
        amount: booking.total_price,
        method: 'card',
        status: 'failed',
        processed_at: new Date(),
      });
      return res.status(402).json({
        error: 'Paiement refusé par la banque',
        payment: failedPayment,
      });
    }

    const payment = await Payment.create({
      booking_id: bookingId,
      amount: booking.total_price,
      method: 'card',
      status: 'completed',
      processed_at: new Date(),
    });

    await booking.update({ status: 'confirmed' });

    const fullBooking = await Booking.findByPk(bookingId, {
      include: [
        { model: Passenger },
        { model: Payment },
        {
          model: Flight,
          include: [
            { model: Airline },
            { model: Airport, as: 'departureAirport' },
            { model: Airport, as: 'arrivalAirport' },
          ],
        },
      ],
    });

    res.status(201).json({
      message: 'Paiement accepté — réservation confirmée',
      booking: fullBooking,
      payment,
    });
  } catch (err) {
    next(err);
  }
};

const getPaymentByBooking = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      where: { booking_id: req.params.bookingId },
      include: [{ model: Booking }],
    });

    if (!payment) {
      return res.status(404).json({ error: 'Paiement non trouvé' });
    }

    if (req.user.role !== 'admin' && payment.Booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    res.status(200).json({ payment });
  } catch (err) {
    next(err);
  }
};

module.exports = { processPayment, getPaymentByBooking };
