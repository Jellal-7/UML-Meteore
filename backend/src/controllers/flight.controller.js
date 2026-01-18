const { Op } = require('sequelize');
const { Flight, Airline, Airport, Booking } = require('../models');

const searchFlights = async (req, res, next) => {
  try {
    const { from, to, date, passengers, price_max, airline_id, sort } = req.query;
    const where = { status: 'scheduled' };
    const includeOptions = [
      { model: Airline },
      { model: Airport, as: 'departureAirport' },
      { model: Airport, as: 'arrivalAirport' },
    ];

    if (passengers) {
      where.available_seats = { [Op.gte]: parseInt(passengers, 10) };
    }

    if (price_max) {
      where.price = { ...where.price, [Op.lte]: parseFloat(price_max) };
    }

    if (airline_id) {
      where.airline_id = parseInt(airline_id, 10);
    }

    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      where.departure_at = {
        [Op.gte]: searchDate,
        [Op.lt]: nextDay,
      };
    }

    if (from) {
      const depAirport = await Airport.findOne({
        where: {
          [Op.or]: [
            { iata_code: from.toUpperCase() },
            { city: { [Op.like]: `%${from}%` } },
          ],
        },
      });
      if (depAirport) {
        where.departure_airport_id = depAirport.id;
      } else {
        return res.status(200).json({ flights: [] });
      }
    }

    if (to) {
      const arrAirport = await Airport.findOne({
        where: {
          [Op.or]: [
            { iata_code: to.toUpperCase() },
            { city: { [Op.like]: `%${to}%` } },
          ],
        },
      });
      if (arrAirport) {
        where.arrival_airport_id = arrAirport.id;
      } else {
        return res.status(200).json({ flights: [] });
      }
    }

    let order = [['price', 'ASC']];
    if (sort === 'departure') order = [['departure_at', 'ASC']];
    if (sort === 'duration') order = [['departure_at', 'ASC']];
    if (sort === 'price_desc') order = [['price', 'DESC']];

    const flights = await Flight.findAll({
      where,
      include: includeOptions,
      order,
    });

    res.status(200).json({ flights });
  } catch (err) {
    next(err);
  }
};

const getFlightById = async (req, res, next) => {
  try {
    const flight = await Flight.findByPk(req.params.id, {
      include: [
        { model: Airline },
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
      ],
    });

    if (!flight) {
      return res.status(404).json({ error: 'Vol non trouvé' });
    }

    res.status(200).json({ flight });
  } catch (err) {
    next(err);
  }
};

const createFlight = async (req, res, next) => {
  try {
    const flight = await Flight.create(req.body);
    const fullFlight = await Flight.findByPk(flight.id, {
      include: [
        { model: Airline },
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
      ],
    });
    res.status(201).json({ flight: fullFlight });
  } catch (err) {
    next(err);
  }
};

const updateFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Vol non trouvé' });
    }

    await flight.update(req.body);

    const updatedFlight = await Flight.findByPk(flight.id, {
      include: [
        { model: Airline },
        { model: Airport, as: 'departureAirport' },
        { model: Airport, as: 'arrivalAirport' },
      ],
    });

    res.status(200).json({ flight: updatedFlight });
  } catch (err) {
    next(err);
  }
};

const deleteFlight = async (req, res, next) => {
  try {
    const flight = await Flight.findByPk(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Vol non trouvé' });
    }

    const activeBookings = await Booking.count({
      where: {
        flight_id: flight.id,
        status: { [Op.in]: ['pending', 'confirmed'] },
      },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        error: 'Impossible de supprimer ce vol : des réservations actives y sont associées',
      });
    }

    await flight.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { searchFlights, getFlightById, createFlight, updateFlight, deleteFlight };
