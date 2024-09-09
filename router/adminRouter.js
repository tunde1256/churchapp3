const express = require('express');
const router = express.Router(); // Correct way to initialize the router
const adminController = require('../controller/adminController'); // Correct path to your controller
const { validateLogin, validateRegister, handleValidationErrors } = require('../middleware/expressValidator');
const { generateToken, authenticateToken } = require('../middleware/jwt'); // Import your JWT middleware if needed

// Admin routes
router.post('/register', validateRegister, handleValidationErrors, adminController.RegisterAdmin);
router.post('/login', validateLogin, handleValidationErrors, adminController.login);
router.delete('/:id', authenticateToken, adminController.deleteAdmin); // Authorization added
router.get('/:id', authenticateToken, adminController.getAdminById); // Authorization added
router.get('/', authenticateToken, adminController.getAdmins); // Authorization added
router.put('/update/:id', authenticateToken, adminController.updateAdmin);


/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management
 */

/**
 * @swagger
 * /admins/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the new admin
 *                 example: admin_user
 *               email:
 *                 type: string
 *                 description: Email address of the new admin
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: Password for the new admin
 *                 example: securepassword123
 *               confirmPassword:
 *                 type: string
 *                 description: Confirmation of the password
 *                 example: securepassword123
 *               role:
 *                 type: string
 *                 description: Role of the new admin
 *                 example: superadmin
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admins/login:
 *   post:
 *     summary: Log in an admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address of the admin
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 description: Password of the admin
 *                 example: securepassword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: your_jwt_token
 *       400:
 *         description: Bad request
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Delete an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the admin to delete
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the admin to fetch
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Get all admins with pagination
 *     tags: [Admins]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of admins per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 10
 *                 admins:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /admins/update/{id}:
 *   put:
 *     summary: Update admin details by ID
 *     tags: [Admins]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the admin to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Updated email address
 *                 example: updatedadmin@example.com
 *               password:
 *                 type: string
 *                 description: New password
 *                 example: newpassword123
 *               role:
 *                 type: string
 *                 description: Updated role
 *                 example: superadmin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not authorized to update admin role)
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */

module.exports = router;
