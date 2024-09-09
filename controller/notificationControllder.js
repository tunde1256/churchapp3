const Notification = require('../model/notificationModel');
const User = require('../model/userModel');
const Admin = require('../model/adminModel');
const mongoose = require('mongoose');


exports.sendNotification = async (req, res) => {
    try {
        const { title, message, recipientId, type } = req.body;

        if (!title || !message || !recipientId) {
            logger.warn('Validation failed: missing title, message, or recipientId', { title, message, recipientId });
            return res.status(400).json({ message: 'Title, message, and recipient are required' });
        }

        // Validate the type (optional)
        const validTypes = ['general', 'alert'];
        if (type && !validTypes.includes(type)) {
            logger.warn('Invalid notification type:', type);
            return res.status(400).json({ message: 'Invalid notification type' });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            logger.warn('Recipient not found:', recipientId);
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // Ensure req.Admin._id exists and is valid
        if (!req.Admin || !req.Admin._id) {
            logger.warn('Unauthorized: Admin not logged in');
            return res.status(401).json({ message: 'Unauthorized: Admin not logged in' });
        }

        const notification = new Notification({
            title,
            message,
            recipient: recipient._id,  // Use recipient._id here
            sender: req.Admin._id,  // Ensure req.Admin._id is valid
            type: type || 'general'  // Default to 'general' if type is not provided
        });

        await notification.save();

        logger.info('Notification sent successfully:', { notification });
        res.status(201).json({ message: 'Notification sent successfully', notification });
    } catch (error) {
        logger.error('Error sending notification:', error);
        res.status(500).json({ message: 'Server error while sending notification' });
    }
};

exports.markNotification = async (req, res) => {
    try {
        const { notificationId } = req.body;
        const adminId = req.Admin?._id;

        if (!notificationId) {
            logger.warn('Validation failed: Notification ID is missing');
            return res.status(400).json({ message: 'Notification ID is required' });
        }

        if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            logger.warn('Invalid Notification ID format:', notificationId);
            return res.status(400).json({ message: 'Invalid Notification ID format' });
        }

        logger.info('Querying for notification with ID:', notificationId);
        const notification = await Notification.findById(notificationId).exec();

        if (!notification) {
            logger.warn('Notification not found for ID:', notificationId);
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.sender.toString() !== adminId.toString()) {
            logger.warn('Admin not authorized to mark this notification as read', { adminId, notificationSender: notification.sender });
            return res.status(403).json({ message: 'You can only mark your own notifications as read' });
        }

        // Mark the notification as read (or update its status)
        notification.status = 'read'; // Example status change
        await notification.save();

        logger.info('Notification marked as read successfully:', { notification });
        res.status(200).json({ message: 'Notification marked as read successfully', notification });
    } catch (error) {
        logger.error('Error marking notification:', error);
        res.status(500).json({ message: 'Error marking notification' });
    }
};

// Get Notifications for a User
exports.getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);

        logger.info('User ID:', req.user._id);

        const notifications = await Notification.find({})
            .populate('sender', 'name')
            .sort({ createdAt: -1 })
            .skip((pageInt - 1) * limitInt)
            .limit(limitInt) || [];

        const totalNotifications = await Notification.countDocuments({ recipient: req.user._id });

        logger.info('Fetched notifications:', { notifications });
        res.json({
            page: pageInt,
            limit: limitInt,
            totalPages: totalNotifications > 0 ? Math.ceil(totalNotifications / limitInt) : 0,
            totalNotifications,
            notifications: notifications.length > 0 ? notifications : []
        });
    } catch (error) {
        logger.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error while fetching notifications' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the notification by its ID
        const notification = await Notification.findByIdAndDelete(id);

        if (!notification) {
            logger.warn('Notification not found:', id);
            return res.status(404).json({ message: 'Notification not found' });
        }

        // Ensure req.user is defined and check if the notification belongs to the user
        if (!req.user) {
            logger.error('User is not authenticated');
            return res.status(401).json({ message: 'Authentication failed' });
        }

        if (notification.recipient.toString() !== req.user._id.toString()) {
            logger.warn('User not authorized to delete this notification', {
                user: req.user._id,
                notificationRecipient: notification.recipient
            });
            return res.status(403).json({ message: 'Not authorized to delete this notification' });
        }

        logger.info('Notification deleted successfully:', { notification });
        res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
        logger.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Server error while deleting notification' });
    }
};