const express = require('express');
const router = express.Router();

const SetPiece = require('../models/SetPiece');
const ArchiveItem = require('../models/ArchiveItem');
const TheoryModule = require('../models/TheoryModule');
const User = require('../models/User');

// @route   GET /api/admin/stats
// @desc    Retrieve dynamic platform statistics directly from MongoDB database
router.get('/stats', async (req, res) => {
  try {
    const [totalSetPieces, totalArchiveItems, totalTheoryModules, totalUsers] = await Promise.all([
      SetPiece.countDocuments(),
      ArchiveItem.countDocuments(),
      TheoryModule.countDocuments(),
      User.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        totalSetPieces,
        totalArchiveItems,
        totalTheoryModules,
        totalUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
