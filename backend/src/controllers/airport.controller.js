const { Op } = require('sequelize');
const { Airport } = require('../models');

const getAllAirports = async (req, res, next) => {
  try {
    const { search } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { iata_code: { [Op.like]: `%${search}%` } },
        { country: { [Op.like]: `%${search}%` } },
      ];
    }

    const airports = await Airport.findAll({ where, order: [['city', 'ASC']] });
    res.status(200).json({ airports });
  } catch (err) {
    next(err);
  }
};

const getAirportById = async (req, res, next) => {
  try {
    const airport = await Airport.findByPk(req.params.id);
    if (!airport) {
      return res.status(404).json({ error: 'Aéroport non trouvé' });
    }
    res.status(200).json({ airport });
  } catch (err) {
    next(err);
  }
};

const createAirport = async (req, res, next) => {
  try {
    const airport = await Airport.create(req.body);
    res.status(201).json({ airport });
  } catch (err) {
    next(err);
  }
};

const updateAirport = async (req, res, next) => {
  try {
    const airport = await Airport.findByPk(req.params.id);
    if (!airport) {
      return res.status(404).json({ error: 'Aéroport non trouvé' });
    }
    await airport.update(req.body);
    res.status(200).json({ airport });
  } catch (err) {
    next(err);
  }
};

const deleteAirport = async (req, res, next) => {
  try {
    const airport = await Airport.findByPk(req.params.id);
    if (!airport) {
      return res.status(404).json({ error: 'Aéroport non trouvé' });
    }
    await airport.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllAirports, getAirportById, createAirport, updateAirport, deleteAirport };
