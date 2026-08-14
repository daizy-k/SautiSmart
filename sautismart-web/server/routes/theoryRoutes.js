const express = require('express');

const router = express.Router();
const TheoryModule = require('../models/TheoryModule');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// @route   GET /api/theory
// @desc    List theory modules, optionally filtered by grade level or strand (Public)
router.get('/', async (req, res) => {
  try {
    const { gradeLevel, strand } = req.query;
    const filter = {};
    if (gradeLevel) filter.gradeLevel = gradeLevel;
    if (strand) filter.strand = strand;

    const modules = await TheoryModule.find(filter).sort({ gradeLevel: 1, order: 1 });
    res.status(200).json({ success: true, count: modules.length, data: modules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/theory/grade/:gradeLevel
// @desc    List theory modules for a single grade level (Public)
router.get('/grade/:gradeLevel', async (req, res) => {
  try {
    const modules = await TheoryModule.find({ gradeLevel: req.params.gradeLevel }).sort({ order: 1 });
    res.status(200).json({ success: true, count: modules.length, data: modules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/theory/:id
// @desc    Get a single theory module by ID (Public)
router.get('/:id', async (req, res) => {
  try {
    const theoryModule = await TheoryModule.findById(req.params.id);
    if (!theoryModule) {
      return res.status(404).json({ success: false, message: 'Theory module not found' });
    }
    res.status(200).json({ success: true, data: theoryModule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/theory
// @desc    Create a new theory module (Protected - Admin Only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const newModule = await TheoryModule.create(req.body);
    res.status(201).json({ success: true, data: newModule });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/theory/:id
// @desc    Update a theory module (Protected - Admin Only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const updatedModule = await TheoryModule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedModule) {
      return res.status(404).json({ success: false, message: 'Theory module not found' });
    }
    res.status(200).json({ success: true, data: updatedModule });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/theory/:id
// @desc    Delete a theory module (Protected - Admin Only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const deletedModule = await TheoryModule.findByIdAndDelete(req.params.id);
    if (!deletedModule) {
      return res.status(404).json({ success: false, message: 'Theory module not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
