const express = require('express');
const router = express.Router();
const attendanceController = require('../controller/attendanceController');
const { authenticateToken } = require('../middleware/jwt');
const { verifyAdmin } = require('../middleware/verifyAdmin');

router.post('/attendance',attendanceController.addAttendance);
router.get('/attendance/reports',authenticateToken,verifyAdmin, attendanceController.getAttendance);
router.get('/attendance/range', authenticateToken,verifyAdmin, attendanceController.getAttendanceByDateRange);
router.get('/attendance/branch', attendanceController.getAttendanceByBranchName);
/**
* @swagger
* tags:
*   - name: Attendance
*     description: Operations related to attendance records
*/
/**
 * @swagger
 * /attendance:
 *   post:
 *     tags:
 *       - Attendance
 *     summary: Add a new attendance record
 *     security:
 *       - bearerAuth: []
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
 *                 example: "2024-08-28"
 *               branch:
 *                 type: string
 *                 description: The ID of the branch where the attendance was recorded
 *                 example: "66cfe0ddf74e0dfe2a08edf8"
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: List of user IDs who attended
 *                   example: ["60d21bbd6437f5f646e0e4d3", "60d21bbd6437f5f646e0e4d4"]
 *               maleCount:
 *                 type: integer
 *                 description: Number of male attendees
 *                 example: 10
 *               femaleCount:
 *                 type: integer
 *                 description: Number of female attendees
 *                 example: 15
 *               childrenCount:
 *                 type: integer
 *                 description: Number of children attendees
 *                 example: 5
 *     responses:
 *       201:
 *         description: Attendance record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 branch:
 *                   type: string
 *                 attendees:
 *                   type: array
 *                   items:
 *                     type: string
 *                 maleCount:
 *                   type: integer
 *                 femaleCount:
 *                   type: integer
 *                 childrenCount:
 *                   type: integer
 *       400:
 *         description: Bad request, missing or invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Date, branch, attendees, maleCount, femaleCount, and childrenCount are required'
 *       404:
 *         description: Branch not found or invalid attendee IDs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error while adding attendance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

/**
* @swagger
* /attendance/range:
*   get:
*     tags:
*       - Attendance
*     summary: Get attendance by date range
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: startDate
*         schema:
*           type: string
*           format: date
*         required: true
*         description: Start date in YYYY-MM-DD format
*       - in: query
*         name: endDate
*         schema:
*           type: string
*           format: date
*         required: true
*         description: End date in YYYY-MM-DD format
*     responses:
*       200:
*         description: Successful response
*       401:
*         description: Unauthorized, JWT token is missing or invalid
*       403:
*         description: Forbidden, admin rights required
*/

/**
* @swagger
* /attendance/branch:
*   get:
*     tags:
*       - Attendance
*     summary: Get attendance by branch
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: query
*         name: branchName
*         schema:
*           type: string
*         required: true
*         description: Name of the branch
*         example: Main Branch
*     responses:
*       200:
*         description: Successful response with attendance records
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
*                     format: date
*                   branch:
*                     type: object
*                     properties:
*                       _id:
*                         type: string
*                       branchName:
*                         type: string
*                   attendees:
*                     type: array
*                     items:
*                       type: object
*                       properties:
*                         _id:
*                           type: string
*                         name:
*                           type: string
*                         status:
*                           type: string
*       400:
*         description: Bad request, missing or invalid query parameters
*       401:
*         description: Unauthorized, JWT token is missing or invalid
*       403:
*         description: Forbidden, admin rights required
*       500:
*         description: Server error
*/

module.exports = router;
