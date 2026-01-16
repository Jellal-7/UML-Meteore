const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Flight = sequelize.define('Flight', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  flight_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  airline_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  departure_airport_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  arrival_airport_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  departure_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  arrival_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  available_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  total_seats: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 180,
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'cancelled'),
    defaultValue: 'scheduled',
  },
}, {
  tableName: 'flights',
  underscored: true,
  timestamps: true,
});

module.exports = Flight;
