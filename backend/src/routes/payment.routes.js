const { Router } = require('express');
const { processPayment, getPaymentByBooking } = require('../controllers/payment.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

/**
 * @openapi
 * /payments/{bookingId}/pay:
 *   post:
 *     tags: [Paiements]
 *     summary: Simuler un paiement par carte bancaire
 *     description: Valide le format CB, vérifie la blacklist de test, passe le booking à confirmed.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: bookingId, required: true, schema: { type: integer } }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [card_number, card_holder, card_expiry, card_cvv]
 *             properties:
 *               card_number: { type: string, example: "4111111111111111" }
 *               card_holder: { type: string, example: "Jean Dupont" }
 *               card_expiry: { type: string, example: "1228" }
 *               card_cvv: { type: string, example: "123" }
 *     responses:
 *       200: { description: Paiement accepté — booking confirmé }
 *       400: { description: Réservation déjà payée ou annulée }
 *       402: { description: Paiement refusé (carte blacklistée) }
 *       422: { description: Informations de carte incomplètes }
 */
router.post('/:bookingId/pay', authenticate, processPayment);

/**
 * @openapi
 * /payments/{bookingId}:
 *   get:
 *     tags: [Paiements]
 *     summary: Consulter le paiement d'une réservation
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: bookingId, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Détail du paiement }
 *       404: { description: Aucun paiement trouvé }
 */
router.get('/:bookingId', authenticate, getPaymentByBooking);

module.exports = router;
