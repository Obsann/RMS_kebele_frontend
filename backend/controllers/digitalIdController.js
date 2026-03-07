const logger = require('../config/logger');
const DigitalId = require('../models/DigitalId');
const User = require('../models/authmodel');

/**
 * Generate digital ID for a user
 */
const generateDigitalId = async (req, res) => {
    try {
        const { userId } = req.body;

        // Authorization check: Only admin can generate ID for others
        if (userId && userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Admin access required to generate IDs for others'
            });
        }

        const targetUserId = userId || req.user.id;

        // Check if user exists
        const user = await User.findById(targetUserId);
        if (!user) {
            return res.status(404).json({ error: 'Not Found', message: 'User not found' });
        }

        // Check if digital ID already exists
        let digitalId = await DigitalId.findOne({ user: targetUserId });

        if (digitalId) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'Digital ID already exists for this user'
            });
        }

        // Generate QR code
        const qrCode = DigitalId.generateQRCode(targetUserId, user.unit);

        // Create digital ID
        digitalId = await DigitalId.create({
            user: targetUserId,
            qrCode,
            status: 'pending'
        });

        // Update user with digital ID reference
        user.digitalId = {
            qrCode,
            status: 'pending'
        };
        await user.save();

        res.status(201).json({
            message: 'Digital ID generated',
            digitalId
        });
    } catch (error) {
        logger.error('GenerateDigitalId error:', error);
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

/**
 * Get all digital IDs (admin)
 */
const getAllDigitalIds = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query = {};
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [digitalIds, total] = await Promise.all([
            DigitalId.find(query)
                .populate('user', 'username email unit phone')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            DigitalId.countDocuments(query)
        ]);

        res.json({
            digitalIds,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        logger.error('GetAllDigitalIds error:', error);
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

/**
 * Get digital ID by user
 */
const getDigitalIdByUser = async (req, res) => {
    try {
        const userId = req.params.userId || req.user.id;

        // Authorization check
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
        }

        const digitalId = await DigitalId.findOne({ user: userId })
            .populate('user', 'username email unit phone');

        if (!digitalId) {
            return res.status(404).json({ error: 'Not Found', message: 'Digital ID not found' });
        }

        res.json(digitalId);
    } catch (error) {
        logger.error('GetDigitalIdByUser error:', error);
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

/**
 * Approve digital ID (admin)
 */
const approveDigitalId = async (req, res) => {
    try {
        const { id } = req.params;

        const digitalId = await DigitalId.findById(id);
        if (!digitalId) {
            return res.status(404).json({ error: 'Not Found', message: 'Digital ID not found' });
        }

        if (digitalId.status === 'approved') {
            return res.status(400).json({ error: 'Bad Request', message: 'Already approved' });
        }

        // Set expiry to 1 year from now
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);

        digitalId.status = 'approved';
        digitalId.issuedAt = new Date();
        digitalId.expiresAt = expiresAt;
        digitalId.approvedBy = req.user.id;
        digitalId.approvedAt = new Date();
        await digitalId.save();

        // Update user's digital ID status
        await User.findByIdAndUpdate(digitalId.user, {
            'digitalId.status': 'approved',
            'digitalId.issuedAt': digitalId.issuedAt,
            'digitalId.expiresAt': expiresAt
        });

        res.json({ message: 'Digital ID approved', digitalId });
    } catch (error) {
        logger.error('ApproveDigitalId error:', error);
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

/**
 * Reject/Revoke digital ID (admin)
 */
const revokeDigitalId = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const digitalId = await DigitalId.findById(id);
        if (!digitalId) {
            return res.status(404).json({ error: 'Not Found', message: 'Digital ID not found' });
        }

        digitalId.status = 'revoked';
        digitalId.revokedBy = req.user.id;
        digitalId.revokedAt = new Date();
        digitalId.revokeReason = reason || 'No reason provided';
        await digitalId.save();

        // Update user's digital ID status
        await User.findByIdAndUpdate(digitalId.user, {
            'digitalId.status': 'revoked'
        });

        res.json({ message: 'Digital ID revoked', digitalId });
    } catch (error) {
        logger.error('RevokeDigitalId error:', error);
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

/**
 * Verify digital ID by QR code
 */
const verifyDigitalId = async (req, res) => {
    try {
        const { qrCode } = req.body;

        if (!qrCode) {
            return res.status(400).json({
                error: 'Bad Request',
                message: 'QR code is required'
            });
        }

        const digitalId = await DigitalId.findOne({ qrCode })
            .populate('user', 'username email unit phone');

        if (!digitalId) {
            return res.status(404).json({
                error: 'Not Found',
                message: 'Invalid QR code',
                valid: false
            });
        }

        // Check if expired
        if (digitalId.status === 'expired' ||
            (digitalId.expiresAt && digitalId.expiresAt < new Date())) {
            digitalId.status = 'expired';
            await digitalId.save();
            return res.status(400).json({
                error: 'Expired',
                message: 'Digital ID has expired',
                valid: false
            });
        }

        if (digitalId.status !== 'approved') {
            return res.status(400).json({
                error: 'Invalid',
                message: `Digital ID is ${digitalId.status}`,
                valid: false
            });
        }

        // Log verification
        digitalId.verifications.push({
            verifiedBy: req.user.id,
            verifiedAt: new Date(),
            method: 'qr_scan'
        });
        digitalId.lastVerified = new Date();
        await digitalId.save();

        res.json({
            valid: true,
            message: 'Digital ID verified successfully',
            user: {
                name: digitalId.user.username,
                unit: digitalId.user.unit,
                email: digitalId.user.email
            },
            issuedAt: digitalId.issuedAt,
            expiresAt: digitalId.expiresAt
        });
    } catch (error) {
        logger.error('VerifyDigitalId error:', error);
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

/**
 * Get digital ID statistics (admin)
 */
const getDigitalIdStats = async (req, res) => {
    try {
        const [total, pending, approved, expired, revoked] = await Promise.all([
            DigitalId.countDocuments(),
            DigitalId.countDocuments({ status: 'pending' }),
            DigitalId.countDocuments({ status: 'approved' }),
            DigitalId.countDocuments({ status: 'expired' }),
            DigitalId.countDocuments({ status: 'revoked' })
        ]);

        res.json({
            total,
            byStatus: { pending, approved, expired, revoked }
        });
    } catch (error) {
        logger.error('GetDigitalIdStats error:', error);
        res.status(500).json({ error: 'Server Error', message: error.message });
    }
};

module.exports = {
    generateDigitalId,
    getAllDigitalIds,
    getDigitalIdByUser,
    approveDigitalId,
    revokeDigitalId,
    verifyDigitalId,
    getDigitalIdStats
};
