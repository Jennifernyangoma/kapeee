import express from 'express';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Hero:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         subtitle:
 *           type: string
 *         image:
 *           type: string
 *         buttonText:
 *           type: string
 *         buttonLink:
 *           type: string
 *         active:
 *           type: boolean
 */

/**
 * @swagger
 * /api/hero:
 *   get:
 *     summary: Get all hero sections
 *     tags: [Hero]
 *     responses:
 *       200:
 *         description: List of hero sections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hero'
 */
router.get('/', async (req, res) => {
  try {
    // Mock hero data - replace with actual hero logic
    res.json([]);
  } catch (error) {
    console.error('Get hero error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
