const { Router } = require('express');
const { createBooking, getUserBookings, getBookingById, cancelBooking, getAllBookings } = require('../controllers/booking.controller');
const { createBookingRules } = require('../validators/booking.validator');
const { validate } = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

/**
 * @openapi
 * /bookings:
 *   post:
 *     tags: [Réservations]
 *     summary: Créer une réservation
 *     description: Vérifie la disponibilité des sièges, crée les passagers et décrémente les places (transaction).
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [flight_id, passengers]
 *             properties:
 *               flight_id: { type: integer, example: 1 }
 *               passengers:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   properties:
 *                     first_name: { type: string, example: Jean }
 *                     last_name: { type: string, example: Dupont }
 *                     birth_date: { type: string, format: date, example: "1990-05-15" }
 *                     passport_number: { type: string, example: FR12345678 }
 *     responses:
 *       201: { description: Réservation créée (status pending) }
 *       400: { description: Places insuffisantes ou vol annulé }
 */
router.post('/', authenticate, createBookingRules, validate, createBooking);

/**
 * @openapi
 * /bookings/my:
 *   get:
 *     tags: [Réservations]
 *     summary: Historique de mes réservations
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des réservations de l'utilisateur connecté }
 */
router.get('/my', authenticate, getUserBookings);

/**
 * @openapi
 * /bookings/admin/all:
 *   get:
 *     tags: [Réservations]
 *     summary: Toutes les réservations (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: query, name: status, schema: { type: string, enum: [pending, confirmed, cancelled] } }
 *       - { in: query, name: page, schema: { type: integer, default: 1 } }
 *       - { in: query, name: limit, schema: { type: integer, default: 20 } }
 *     responses:
 *       200: { description: Liste paginée avec total et totalPages }
 *       403: { description: Accès refusé }
 */
router.get('/admin/all', authenticate, authorize('admin'), getAllBookings);

/**
 * @openapi
 * /bookings/{id}:
 *   get:
 *     tags: [Réservations]
 *     summary: Détail d'une réservation
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Détail avec passagers, vol et paiement }
 *       403: { description: Accès refusé (ni propriétaire ni admin) }
 *       404: { description: Réservation non trouvée }
 */
router.get('/:id', authenticate, getBookingById);

/**
 * @openapi
 * /bookings/{id}/cancel:
 *   patch:
 *     tags: [Réservations]
 *     summary: Annuler une réservation
 *     description: Uniquement si le vol n'a pas encore eu lieu. Restitue les sièges (transaction).
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Réservation annulée (status cancelled) }
 *       400: { description: Vol déjà passé ou réservation déjà annulée }
 */
router.patch('/:id/cancel', authenticate, cancelBooking);

module.exports = router;
