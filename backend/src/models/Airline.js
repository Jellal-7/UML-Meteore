const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Airline = sequelize.define('Airline', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'airlines',
  underscored: true,
  timestamps: true,
});

module.exports = Airline;
