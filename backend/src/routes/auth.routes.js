const { Router } = require('express');
const { register, login, getProfile, updateProfile } = require('../controllers/auth.controller');
const { registerRules, loginRules } = require('../validators/auth.validator');
const { validate } = require('../middlewares/validate');
const { authenticate } = require('../middlewares/auth');

const router = Router();

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Authentification]
 *     summary: Créer un compte utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, email, password]
 *             properties:
 *               first_name: { type: string, example: Jean }
 *               last_name: { type: string, example: Dupont }
 *               email: { type: string, format: email, example: jean@email.com }
 *               password: { type: string, minLength: 6, example: motdepasse123 }
 *     responses:
 *       201: { description: Compte créé — retourne un JWT + infos utilisateur }
 *       409: { description: Email déjà utilisé }
 *       422: { description: Validation échouée }
 */
router.post('/register', registerRules, validate, register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Authentification]
 *     summary: Se connecter
 *     description: Retourne un JWT si les identifiants sont corrects. Message d'erreur générique en cas d'échec (sécurité).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: jean.dupont@email.com }
 *               password: { type: string, example: user123 }
 *     responses:
 *       200: { description: Connexion réussie — retourne un JWT }
 *       401: { description: Email ou mot de passe incorrect }
 */
router.post('/login', loginRules, validate, login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Authentification]
 *     summary: Obtenir le profil de l'utilisateur connecté
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profil utilisateur (sans password_hash) }
 *       401: { description: Token manquant ou invalide }
 */
router.get('/me', authenticate, getProfile);

/**
 * @openapi
 * /auth/profile:
 *   put:
 *     tags: [Authentification]
 *     summary: Modifier son profil
 *     description: La modification du mot de passe nécessite le champ current_password.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name: { type: string }
 *               last_name: { type: string }
 *               email: { type: string, format: email }
 *               current_password: { type: string }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       200: { description: Profil mis à jour }
 *       401: { description: Ancien mot de passe incorrect }
 */
router.put('/profile', authenticate, updateProfile);

module.exports = router;
