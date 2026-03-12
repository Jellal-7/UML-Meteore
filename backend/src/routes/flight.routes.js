const { Router } = require('express');
const { searchFlights, getFlightById, createFlight, updateFlight, deleteFlight } = require('../controllers/flight.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

/**
 * @openapi
 * /flights/search:
 *   get:
 *     tags: [Vols]
 *     summary: Rechercher des vols
 *     parameters:
 *       - { in: query, name: from, schema: { type: string }, description: "Code IATA ou ville de départ (ex: CDG)" }
 *       - { in: query, name: to, schema: { type: string }, description: "Code IATA ou ville d'arrivée (ex: JFK)" }
 *       - { in: query, name: date, schema: { type: string, format: date }, description: "Date de départ (YYYY-MM-DD)" }
 *       - { in: query, name: passengers, schema: { type: integer }, description: "Nombre de passagers" }
 *       - { in: query, name: price_max, schema: { type: number }, description: "Prix maximum par personne" }
 *       - { in: query, name: airline_id, schema: { type: integer }, description: "Filtrer par compagnie" }
 *       - { in: query, name: sort, schema: { type: string, enum: [price, price_desc, departure, duration] }, description: "Tri (défaut: price)" }
 *     responses:
 *       200: { description: Liste des vols correspondants }
 */
router.get('/search', searchFlights);

/**
 * @openapi
 * /flights/{id}:
 *   get:
 *     tags: [Vols]
 *     summary: Détail d'un vol
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Détail du vol avec compagnie et aéroports }
 *       404: { description: Vol non trouvé }
 */
router.get('/:id', getFlightById);

/**
 * @openapi
 * /flights:
 *   post:
 *     tags: [Vols]
 *     summary: Créer un vol (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Flight' }
 *     responses:
 *       201: { description: Vol créé }
 *       403: { description: Accès refusé — rôle admin requis }
 */
router.post('/', authenticate, authorize('admin'), createFlight);

/**
 * @openapi
 * /flights/{id}:
 *   put:
 *     tags: [Vols]
 *     summary: Modifier un vol (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Flight' }
 *     responses:
 *       200: { description: Vol modifié }
 *       404: { description: Vol non trouvé }
 *   delete:
 *     tags: [Vols]
 *     summary: Supprimer un vol (admin)
 *     description: Bloqué si des réservations actives (pending/confirmed) sont associées.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Vol supprimé }
 *       400: { description: Réservations actives associées — suppression bloquée }
 *       404: { description: Vol non trouvé }
 */
router.put('/:id', authenticate, authorize('admin'), updateFlight);
router.delete('/:id', authenticate, authorize('admin'), deleteFlight);

module.exports = router;
