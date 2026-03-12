const { Router } = require('express');
const { getAllAirlines, getAirlineById, createAirline, updateAirline, deleteAirline } = require('../controllers/airline.controller');
const { authenticate, authorize } = require('../middlewares/auth');

const router = Router();

/**
 * @openapi
 * /airlines:
 *   get:
 *     tags: [Compagnies aériennes]
 *     summary: Lister toutes les compagnies
 *     responses:
 *       200: { description: Liste des compagnies }
 *   post:
 *     tags: [Compagnies aériennes]
 *     summary: Créer une compagnie (admin)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Airline' }
 *     responses:
 *       201: { description: Compagnie créée }
 *       403: { description: Accès refusé }
 */
router.get('/', getAllAirlines);
/**
 * @openapi
 * /airlines/{id}:
 *   get:
 *     tags: [Compagnies aériennes]
 *     summary: Détail d'une compagnie
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       200: { description: Détail }
 *       404: { description: Non trouvée }
 *   put:
 *     tags: [Compagnies aériennes]
 *     summary: Modifier une compagnie (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Airline' }
 *     responses:
 *       200: { description: Modifiée }
 *   delete:
 *     tags: [Compagnies aériennes]
 *     summary: Supprimer une compagnie (admin)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer } }
 *     responses:
 *       204: { description: Supprimée }
 */
router.get('/:id', getAirlineById);
router.post('/', authenticate, authorize('admin'), createAirline);
router.put('/:id', authenticate, authorize('admin'), updateAirline);
router.delete('/:id', authenticate, authorize('admin'), deleteAirline);

module.exports = router;
