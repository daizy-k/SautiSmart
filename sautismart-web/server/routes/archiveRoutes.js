const express = require('express');

const router = express.Router();
// Import the ArchiveItem Mongoose schema model
const ArchiveItem = require('../models/ArchiveItem');

// @route   GET /api/archive
// @desc    List cultural archive items, optionally filtered by tribe, occasion, item type, or grade level
router.get('/', async (req, res) => {
  try {
    // Extract optional query parameters from request URL
    const { tribe, occasion, itemType, grade } = req.query;
    const filter = {};

    // Build dynamic MongoDB query filter object
    if (tribe) filter.tribeOfOrigin = tribe;
    if (occasion) filter.culturalOccasion = occasion;
    if (itemType) filter.itemType = itemType;
    if (grade) filter.gradeLevel = grade;

    // Retrieve items from MongoDB sorted by newest first
    const items = await ArchiveItem.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/archive/:id
// @desc    Get a single archive item by its MongoDB unique ObjectID
router.get('/:id', async (req, res) => {
  try {
    const item = await ArchiveItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Archive item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/archive
// @desc    Create a new cultural archive item entry in the database
router.post('/', async (req, res) => {
  try {
    const newItem = await ArchiveItem.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/archive/:id
// @desc    Update an existing cultural archive item by ID
router.put('/:id', async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const updatedItem = await ArchiveItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Archive item not found' });
    }
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/archive/:id
// @desc    Delete an archive item entry from the database
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await ArchiveItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Archive item not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
