import express from 'express';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Icon:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         icon:
 *           type: string
 *         active:
 *           type: boolean
 */

/**
 * @swagger
 * /api/icons:
 *   get:
 *     summary: Get all icons
 *     tags: [Icons]
 *     responses:
 *       200:
 *         description: List of icons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Icon'
 */
router.get('/', async (req, res) => {
  try {
    // Mock icons data - replace with actual icons logic
    res.json([]);
  } catch (error) {
    console.error('Get icons error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/icons/active:
 *   get:
 *     summary: Get active icons only
 *     tags: [Icons]
 *     responses:
 *       200:
 *         description: List of active icons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Icon'
 */
router.get('/active', async (req, res) => {
  try {
    // Mock active icons data - replace with actual logic
    res.json([]);
  } catch (error) {
    console.error('Get active icons error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
