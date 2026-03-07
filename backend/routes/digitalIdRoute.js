const express = require('express');
const {
    generateDigitalId,
    getAllDigitalIds,
    getDigitalIdByUser,
    approveDigitalId,
    revokeDigitalId,
    verifyDigitalId,
    getDigitalIdStats
} = require('../controllers/digitalIdController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get statistics (admin only)
router.get('/stats', adminAuth, getDigitalIdStats);

// Generate digital ID (user for self, admin for any)
router.post('/generate', generateDigitalId);

// Get all digital IDs (admin only)
router.get('/', adminAuth, getAllDigitalIds);

// Verify by QR code (any employee/admin)
router.post('/verify', verifyDigitalId);

// Get digital ID by user
router.get('/user/:userId', getDigitalIdByUser);

// Get own digital ID
router.get('/me', (req, res, next) => {
    req.params.userId = req.user.id;
    next();
}, getDigitalIdByUser);

// Approve digital ID (admin only)
router.post('/:id/approve', adminAuth, approveDigitalId);

// Revoke digital ID (admin only)
router.post('/:id/revoke', adminAuth, revokeDigitalId);

module.exports = router;
