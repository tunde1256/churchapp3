const express = require('express');
const router = express.Router();
const financialController = require('../controller/financialController');
const { authenticateToken } = require('../middleware/jwt');
const { verifyAdmin } = require('../middleware/verifyAdmin');

router.post('/financial/add', financialController.addFinancialRecord);
router.get('/financial/getAll',authenticateToken,verifyAdmin, financialController.getFinancialReport);
router.put('/financial/:id',authenticateToken,verifyAdmin,  financialController.updateFinancialRecord);
router.delete('/financial/:id', authenticateToken,verifyAdmin, financialController.deleteFinancialRecord);
router.get('/financial/branch', authenticateToken,verifyAdmin, financialController.getFinancialByBranch);
router.get('/financial/date-range',authenticateToken,verifyAdmin, financialController.getFinancialByDate);
router.get('/financial/type',authenticateToken,verifyAdmin,financialController.getFinancialByType);
/**
 * @swagger
 * tags:
 *   - name: Financial
 *     description: Operations related to financial records
 */

/**
 * @swagger
 * /financial/add:
 *   post:
 *     summary: Add a new financial record
 *     tags:
 *       - Financial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-08-01"
 *               branchName:
 *                 type: string
 *                 example: "Main Branch"
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 5000.00
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: "income"
 *               description:
 *                 type: string
 *                 example: "Monthly donation"
 *             required:
 *               - date
 *               - branchName
 *               - amount
 *               - type
 *     responses:
 *       201:
 *         description: Financial record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 date:
 *                   type: string
 *                 branch:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 type:
 *                   type: string
 *                 description:
 *                   type: string
 *                 branchName:
 *                   type: string
 *       400:
 *         description: Bad request, missing or invalid fields
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /financial/getAll:
 *   get:
 *     summary: Get all financial records with optional filters
 *     tags:
 *       - Financial
 *     parameters:
 *       - in: query
 *         name: branch
 *         schema:
 *           type: string
 *         description: Branch ID to filter records
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for filtering records
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for filtering records
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: Successful response with financial records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRecords:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 records:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       date:
 *                         type: string
 *                       branch:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       type:
 *                         type: string
 *                       description:
 *                         type: string
 *       400:
 *         description: Bad request, invalid query parameters
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /financial/{id}:
 *   put:
 *     summary: Update an existing financial record
 *     tags:
 *       - Financial
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the financial record to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 6000.00
 *               description:
 *                 type: string
 *                 example: "Updated monthly donation"
 *             required:
 *               - amount
 *               - description
 *     responses:
 *       200:
 *         description: Financial record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 date:
 *                   type: string
 *                 branch:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 type:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Bad request, missing or invalid fields
 *       404:
 *         description: Financial record not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /financial/{id}:
 *   delete:
 *     summary: Delete a financial record
 *     tags:
 *       - Financial
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the financial record to delete
 *     responses:
 *       200:
 *         description: Financial record deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 date:
 *                   type: string
 *                 branch:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 type:
 *                   type: string
 *                 description:
 *                   type: string
 *       404:
 *         description: Financial record not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /financial/branch:
 *   get:
 *     summary: Get financial records by branch name
 *     tags:
 *       - Financial
 *     parameters:
 *       - in: query
 *         name: branchName
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the branch to filter records
 *     responses:
 *       200:
 *         description: Successful response with financial records
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 date:
 *                   type: string
 *                 branch:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 type:
 *                   type: string
 *                 description:
 *                   type: string
 *       400:
 *         description: Bad request, branchName is required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /financial/date-range:
 *   get:
 *     summary: Get financial records by date range
 *     tags:
 *       - Financial
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Start date for filtering records
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: End date for filtering records
 *     responses:
 *       200:
 *         description: Successful response with financial records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   date:
 *                     type: string
 *                   branch:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *                   description:
 *                     type: string
 *       400:
 *         description: Bad request, invalid date range
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /financial/type:
 *   get:
 *     summary: Get financial records by type
 *     tags:
 *       - Financial
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         required: true
 *         description: Type of financial record to filter
 *     responses:
 *       200:
 *         description: Successful response with financial records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   date:
 *                     type: string
 *                   branch:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *                   description:
 *                     type: string
 *       400:
 *         description: Bad request, type is required
 *       500:
 *         description: Server error
 */


module.exports = router;
