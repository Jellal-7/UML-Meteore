const { Airline } = require('../models');

const getAllAirlines = async (req, res, next) => {
  try {
    const airlines = await Airline.findAll({ order: [['name', 'ASC']] });
    res.status(200).json({ airlines });
  } catch (err) {
    next(err);
  }
};

const getAirlineById = async (req, res, next) => {
  try {
    const airline = await Airline.findByPk(req.params.id);
    if (!airline) {
      return res.status(404).json({ error: 'Compagnie aérienne non trouvée' });
    }
    res.status(200).json({ airline });
  } catch (err) {
    next(err);
  }
};

const createAirline = async (req, res, next) => {
  try {
    const airline = await Airline.create(req.body);
    res.status(201).json({ airline });
  } catch (err) {
    next(err);
  }
};

const updateAirline = async (req, res, next) => {
  try {
    const airline = await Airline.findByPk(req.params.id);
    if (!airline) {
      return res.status(404).json({ error: 'Compagnie aérienne non trouvée' });
    }
    await airline.update(req.body);
    res.status(200).json({ airline });
  } catch (err) {
    next(err);
  }
};

const deleteAirline = async (req, res, next) => {
  try {
    const airline = await Airline.findByPk(req.params.id);
    if (!airline) {
      return res.status(404).json({ error: 'Compagnie aérienne non trouvée' });
    }
    await airline.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllAirlines, getAirlineById, createAirline, updateAirline, deleteAirline };
