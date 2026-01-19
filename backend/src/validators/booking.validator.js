const { body } = require('express-validator');

const createBookingRules = [
  body('flight_id')
    .isInt({ min: 1 })
    .withMessage('ID de vol invalide'),
  body('passengers')
    .isArray({ min: 1 })
    .withMessage('Au moins un passager est requis'),
  body('passengers.*.first_name')
    .trim()
    .notEmpty()
    .withMessage('Le prénom du passager est requis'),
  body('passengers.*.last_name')
    .trim()
    .notEmpty()
    .withMessage('Le nom du passager est requis'),
  body('passengers.*.birth_date')
    .isDate()
    .withMessage('Date de naissance invalide'),
  body('passengers.*.passport_number')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Numéro de passeport invalide'),
];

module.exports = { createBookingRules };
