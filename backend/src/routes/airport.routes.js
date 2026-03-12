const { Router } = require('express');
const { getAllAirports, getAirportById, createAirport, updateAirport, deleteAirport } = require('../controllers/airport.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

/**
 * @openapi
 * /airports:
 *   get:
 *     tags: [Aéroports]
 *     summary: Lister tous les aéroports
 *     parameters:
 *       - { in: query, name: search, schema: { type: string }, description: "Recherche par nom, ville, code IATA ou pays" }
 *     responses:
 *       200: { description: Liste des aéroports triés par ville }
 *   post:
 *     tags: [Aéroports]
 *     summary: Créer un aéroport (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Airport' }
 *     responses:
 *       201: { description: Aéroport créé }
 *       403: { description: Accès refusé }
 */
router.get('/', getAllAirports);
/**
 * @openapi
 * /airports/{id}:
 *   get:
 *     tags: [Aéroports]
 *     summary: Détail d'un aéroport
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Détail de l'aéroport }
 *       404: { description: Aéroport non trouvé }
 *   put:
 *     tags: [Aéroports]
 *     summary: Modifier un aéroport (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Airport' }
 *     responses:
 *       200: { description: Aéroport modifié }
 *   delete:
 *     tags: [Aéroports]
 *     summary: Supprimer un aéroport (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Supprimé }
 */
router.get('/:id', getAirportById);
router.post('/', authenticate, authorize('admin'), createAirport);
router.put('/:id', authenticate, authorize('admin'), updateAirport);
router.delete('/:id', authenticate, authorize('admin'), deleteAirport);

module.exports = router;
