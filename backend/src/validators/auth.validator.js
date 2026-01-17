const { body } = require('express-validator');

const registerRules = [
  body('first_name')
    .trim()
    .notEmpty()
    .withMessage('Le prénom est requis'),
  body('last_name')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Adresse email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
];

const loginRules = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Adresse email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis'),
];

module.exports = { registerRules, loginRules };
