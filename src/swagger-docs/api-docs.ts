/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ARCHNEST STUDIO API DOCUMENTATION
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterPayload'
 *     responses:
 *       201:
 *         description: User registered successfully
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginPayload'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// USER ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /users/me/profile:
 *   get:
 *     tags: [Users]
 *     summary: Get my profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile details
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User details
 */

// ═══════════════════════════════════════════════════════════════════════════════
// BANNER ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @swagger
 * /banners:
 *   get:
 *     tags: [Banners]
 *     summary: Get all banners
 *     responses:
 *       200:
 *         description: List of banners
 */

/**
 * @swagger
 * /banners:
 *   post:
 *     tags: [Banners]
 *     summary: Create a new banner (Admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Banner created
 */

export {};
