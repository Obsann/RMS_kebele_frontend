const express = require('express');
const {
    getUserNotifications,
    markAsRead,
    markAllRead,
    deleteNotification,
    sendAnnouncement
} = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get own notifications
router.get('/', getUserNotifications);

// Mark single notification as read
router.patch('/:id/read', markAsRead);

// Mark all as read
router.patch('/read-all', markAllRead);

// Delete a notification
router.delete('/:id', deleteNotification);

// Send announcement (admin only)
router.post('/announce', adminAuth, sendAnnouncement);

module.exports = router;
