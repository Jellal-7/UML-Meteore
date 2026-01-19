const { sequelize, Booking, Passenger, Flight, Airline, Airport, User, Payment } = require('../models');

const createBooking = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { flight_id, passengers } = req.body;

    const flight = await Flight.findByPk(flight_id, { transaction: t, lock: true });
    if (!flight) {
      await t.rollback();
      return res.status(404).json({ error: 'Vol non trouvé' });
    }

    if (flight.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({ error: 'Ce vol a été annulé' });
    }

    if (flight.available_seats < passengers.length) {
      await t.rollback();
      return res.status(400).json({ error: 'Nombre de places insuffisant' });
    }

    const total_price = parseFloat(flight.price) * passengers.length;

    const booking = await Booking.create(
      {
        user_id: req.user.id,
        flight_id,
        total_price,
        status: 'pending',
      },
      { transaction: t }
    );

    const passengersData = passengers.map((p) => ({
      ...p,
      booking_id: booking.id,
    }));

    await Passenger.bulkCreate(passengersData, { transaction: t });

    await flight.update(
      { available_seats: flight.available_seats - passengers.length },
      { transaction: t }
    );

    await t.commit();

    const fullBooking = await Booking.findByPk(booking.id, {
      include: [
        { model: Passenger },
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

    res.status(201).json({ booking: fullBooking });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { user_id: req.user.id },
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
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({ bookings });
  } catch (err) {
    next(err);
  }
};

const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Passenger },
        { model: Payment },
        { model: User },
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

    if (!booking) {
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (req.user.role !== 'admin' && booking.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Accès interdit' });
    }

    res.status(200).json({ booking });
  } catch (err) {
    next(err);
  }
};

const cancelBooking = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Flight }, { model: Passenger }],
      transaction: t,
    });

    if (!booking) {
      await t.rollback();
      return res.status(404).json({ error: 'Réservation non trouvée' });
    }

    if (booking.user_id !== req.user.id) {
      await t.rollback();
      return res.status(403).json({ error: 'Accès interdit' });
    }

    if (booking.status === 'cancelled') {
      await t.rollback();
      return res.status(400).json({ error: 'Cette réservation est déjà annulée' });
    }

    if (new Date(booking.Flight.departure_at) <= new Date()) {
      await t.rollback();
      return res.status(400).json({ error: 'Impossible d\'annuler une réservation pour un vol passé' });
    }

    await booking.update({ status: 'cancelled' }, { transaction: t });

    const passengerCount = booking.Passengers ? booking.Passengers.length : 0;
    if (passengerCount > 0) {
      await Flight.update(
        { available_seats: booking.Flight.available_seats + passengerCount },
        { where: { id: booking.flight_id }, transaction: t }
      );
    }

    await t.commit();

    const updatedBooking = await Booking.findByPk(booking.id, {
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

    res.status(200).json({ booking: updatedBooking });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const { count, rows: bookings } = await Booking.findAndCountAll({
      where,
      include: [
        { model: User },
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
      order: [['created_at', 'DESC']],
      limit: parseInt(limit, 10),
      offset,
    });

    res.status(200).json({
      bookings,
      pagination: {
        total: count,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(count / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { createBooking, getUserBookings, getBookingById, cancelBooking, getAllBookings };
