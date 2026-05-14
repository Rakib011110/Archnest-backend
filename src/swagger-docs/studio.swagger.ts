/**
 * @swagger
 * tags:
 *   - name: Services
 *     description: Service management (Admin only for mutations)
 *   - name: Projects
 *     description: Portfolio projects
 *   - name: Gallery
 *     description: Photo/Video/VR gallery
 *   - name: Blog
 *     description: News & Articles
 *   - name: Testimonials
 *     description: Client reviews
 *   - name: Team
 *     description: Studio team members
 *   - name: Inquiries
 *     description: Project inquiries (Public submission)
 *   - name: Bookings
 *     description: Consultation bookings (Public submission)
 *   - name: Settings
 *     description: Global site settings
 * 
 * components:
 *   schemas:
 *     Service:
 *       type: object
 *       properties:
 *         title: { type: string, example: "Architectural Design" }
 *         slug: { type: string, example: "architectural-design" }
 *         shortDescription: { type: string }
 *         isActive: { type: boolean, example: true }
 *     Project:
 *       type: object
 *       properties:
 *         title: { type: string, example: "Modern Villa" }
 *         category: { type: string, enum: [RESIDENTIAL, COMMERCIAL, INSTITUTIONAL, LANDSCAPE] }
 *         market: { type: string, enum: [INTERNATIONAL, LOCAL] }
 *         status: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
 *     Blog:
 *       type: object
 *       properties:
 *         title: { type: string }
 *         content: { type: string, description: "Markdown content" }
 *         status: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
 *     Inquiry:
 *       type: object
 *       properties:
 *         name: { type: string }
 *         email: { type: string }
 *         projectType: { type: string }
 *         market: { type: string, description: "Optional" }
 *         budgetRange: { type: string, description: "Optional" }
 *         message: { type: string }
 *         status: { type: string, enum: [NEW, CONTACTED, IN_PROGRESS, CLOSED] }
 * 
 * # -------------------------------------------------------------------------
 * # INQUIRIES API
 * # -------------------------------------------------------------------------
 * /api/inquiries:
 *   post:
 *     tags: [Inquiries]
 *     summary: Submit a new inquiry
 *     description: Public endpoint to submit a project inquiry with optional file attachments
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               projectType: { type: string }
 *               market: { type: string }
 *               budgetRange: { type: string }
 *               message: { type: string }
 *               files:
 *                 type: array
 *                 items: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Inquiry submitted successfully
 *   get:
 *     tags: [Inquiries]
 *     summary: Get all inquiries
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of inquiries
 * 
 * /api/inquiries/{id}:
 *   patch:
 *     tags: [Inquiries]
 *     summary: Update inquiry status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Updated successfully
 * 
 * # -------------------------------------------------------------------------
 * # BOOKINGS API
 * # -------------------------------------------------------------------------
 * /api/bookings:
 *   post:
 *     tags: [Bookings]
 *     summary: Book a consultation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName: { type: string }
 *               clientEmail: { type: string }
 *               date: { type: string, format: date }
 *               startTime: { type: string }
 *               endTime: { type: string }
 *     responses:
 *       201:
 *         description: Booking confirmed
 *   get:
 *     tags: [Bookings]
 *     summary: Get all bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 * 
 * /api/settings:
 *   get:
 *     tags: [Settings]
 *     summary: Get public site settings
 *     responses:
 *       200:
 *         description: Global configuration
 *   patch:
 *     tags: [Settings]
 *     summary: Update site settings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings updated
 */
