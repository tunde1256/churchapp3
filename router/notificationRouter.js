const express = require('express');
const notificationController = require('../controller/notificationControllder');
const { verifyAdmin } = require('../middleware/verifyAdmin');
const { authenticateToken } = require('../middleware/jwt');
const { authenticateAdmin } = require('../middleware/authenticateAdmin');
const authenticateUser = require('../middleware/authenticateUser');

const router = express.Router();

router.post('/notifications',  notificationController.sendNotification);
router.get('/notifications/getAll',  notificationController.getNotifications);
router.delete('/notifications/:id',  notificationController.deleteNotification);
router.post('/notifications/:id/markasRead',  notificationController.markNotification);

/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Operations related to notifications
 */

/**
 * @swagger
 * /notifications:
 *   post:
 *     summary: Send a notification
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Meeting Reminder"
 *               message:
 *                 type: string
 *                 example: "Don't forget the meeting at 10 AM."
 *               recipientId:
 *                 type: string
 *                 example: "60d5f9d3d8f8b30e8c8b4567"
 *               type:
 *                 type: string
 *                 enum: [general, alert]
 *                 example: "general"
 *             required:
 *               - title
 *               - message
 *               - recipientId
 *     responses:
 *       201:
 *         description: Notification sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification sent successfully"
 *                 notification:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     message:
 *                       type: string
 *                     recipient:
 *                       type: string
 *                     sender:
 *                       type: string
 *                     type:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *       400:
 *         description: Bad request, missing or invalid fields
 *       401:
 *         description: Unauthorized, JWT token is missing or invalid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /notifications/getAll:
 *   get:
 *     summary: Get all notifications for a user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response with notifications
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
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *                 totalNotifications:
 *                   type: integer
 *                   example: 20
 *                 notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       message:
 *                         type: string
 *                       sender:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                       name:
 *                         type: string
 *                         example: "John Doe"
 *       401:
 *         description: Unauthorized, JWT token is missing or invalid
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /notifications/{id}/markasRead:
 *   post:
 *     summary: Mark a notification as read
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to mark as read
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notificationId:
 *                 type: string
 *                 example: "60d5f9d3d8f8b30e8c8b4567"
 *             required:
 *               - notificationId
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification marked as read successfully"
 *                 notification:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     title:
 *                       type: string
 *                     message:
 *                       type: string
 *                     status:
 *                       type: string
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *       400:
 *         description: Bad request, notificationId is missing or invalid
 *       401:
 *         description: Unauthorized, JWT token is missing or invalid
 *       403:
 *         description: Forbidden, admin rights required
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Notification deleted successfully"
 *       400:
 *         description: Bad request, invalid ID format
 *       401:
 *         description: Unauthorized, JWT token is missing or invalid
 *       403:
 *         description: Forbidden, not authorized to delete this notification
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */

module.exports = router;
