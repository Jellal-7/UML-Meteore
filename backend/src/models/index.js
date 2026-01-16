const sequelize = require('../config/database');
const User = require('./User');
const Airline = require('./Airline');
const Airport = require('./Airport');
const Flight = require('./Flight');
const Booking = require('./Booking');
const Passenger = require('./Passenger');
const Payment = require('./Payment');

// ── Associations ──

// User <-> Booking
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

// Airline <-> Flight
Airline.hasMany(Flight, { foreignKey: 'airline_id' });
Flight.belongsTo(Airline, { foreignKey: 'airline_id' });

// Airport <-> Flight (départ)
Airport.hasMany(Flight, { as: 'departures', foreignKey: 'departure_airport_id' });
Flight.belongsTo(Airport, { as: 'departureAirport', foreignKey: 'departure_airport_id' });

// Airport <-> Flight (arrivée)
Airport.hasMany(Flight, { as: 'arrivals', foreignKey: 'arrival_airport_id' });
Flight.belongsTo(Airport, { as: 'arrivalAirport', foreignKey: 'arrival_airport_id' });

// Flight <-> Booking
Flight.hasMany(Booking, { foreignKey: 'flight_id' });
Booking.belongsTo(Flight, { foreignKey: 'flight_id' });

// Booking <-> Passenger (composition)
Booking.hasMany(Passenger, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
Passenger.belongsTo(Booking, { foreignKey: 'booking_id' });

// Booking <-> Payment (composition)
Booking.hasOne(Payment, { foreignKey: 'booking_id' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

module.exports = {
  sequelize,
  User,
  Airline,
  Airport,
  Flight,
  Booking,
  Passenger,
  Payment,
};
