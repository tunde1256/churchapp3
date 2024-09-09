const express = require('express');
const router = express.Router();
const branchController = require('../controller/branchController');
const { verifyAdmin } = require('../middleware/verifyAdmin');
const { authenticateToken } = require('../middleware/jwt');
const authenticateAdmin = require('../middleware/jwt');

// Correct the order of middleware in the routes
router.get('/getAll', authenticateToken, branchController.getBranches);
router.get('/:id', authenticateToken, branchController.getBranchById);
router.post('/', authenticateToken, verifyAdmin, branchController.addBranch); // authenticateToken first
router.put('/:id',authenticateToken ,verifyAdmin,branchController.updateBranch); // authenticateToken first
router.delete('/:id', authenticateToken, verifyAdmin, branchController.deleteBranch); // authenticateToken first


/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: Branch management
 */

/**
 * @swagger
 * /branches/getAll:
 *   get:
 *     summary: Get all branches with pagination
 *     tags: [Branches]
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
 *         description: Number of branches per page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of branches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalBranches:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 branches:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       branchName:
 *                         type: string
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       state:
 *                         type: string
 *                       country:
 *                         type: string
 *                       leadPastor:
 *                         type: string
 *                       contactNumber:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.get('/getAll', authenticateToken, branchController.getBranches);

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Get a branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the branch to fetch
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Branch found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 branchName:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 leadPastor:
 *                   type: string
 *                 contactNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticateToken, branchController.getBranchById);

/**
 * @swagger
 * /branches:
 *   post:
 *     summary: Add a new branch
 *     tags: [Branches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branchName:
 *                 type: string
 *                 description: Name of the branch
 *               address:
 *                 type: string
 *                 description: Address of the branch
 *               city:
 *                 type: string
 *                 description: City where the branch is located
 *               state:
 *                 type: string
 *                 description: State where the branch is located
 *               country:
 *                 type: string
 *                 description: Country where the branch is located
 *               leadPastor:
 *                 type: string
 *                 description: Name of the lead pastor
 *               contactNumber:
 *                 type: string
 *                 description: Contact number of the branch
 *               email:
 *                 type: string
 *                 description: Email address of the branch
 *               phone:
 *                 type: string
 *                 description: Phone number of the branch
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Branch added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 branchName:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 leadPastor:
 *                   type: string
 *                 contactNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, verifyAdmin, branchController.addBranch);

/**
 * @swagger
 * /branches/{id}:
 *   put:
 *     summary: Update an existing branch
 *     tags: [Branches]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the branch to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               branchName:
 *                 type: string
 *                 description: Updated name of the branch
 *               address:
 *                 type: string
 *                 description: Updated address of the branch
 *               city:
 *                 type: string
 *                 description: Updated city
 *               state:
 *                 type: string
 *                 description: Updated state
 *               country:
 *                 type: string
 *                 description: Updated country
 *               leadPastor:
 *                 type: string
 *                 description: Updated lead pastor
 *               contactNumber:
 *                 type: string
 *                 description: Updated contact number
 *               email:
 *                 type: string
 *                 description: Updated email address
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Branch updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 branchName:
 *                   type: string
 *                 address:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 country:
 *                   type: string
 *                 leadPastor:
 *                   type: string
 *                 contactNumber:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Bad request
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, verifyAdmin, branchController.updateBranch);

/**
 * @swagger
 * /branches/{id}:
 *   delete:
 *     summary: Delete a branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the branch to delete
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Branch deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Branch deleted successfully
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, verifyAdmin, branchController.deleteBranch);



module.exports = router;
