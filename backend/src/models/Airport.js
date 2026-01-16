const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Airport = sequelize.define('Airport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  iata_code: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    unique: true,
  },
  city: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  tableName: 'airports',
  underscored: true,
  timestamps: true,
});

module.exports = Airport;
