const express = require('express');

const router = express.Router();
const SetPiece = require('../models/SetPiece');

// @route   GET /api/setpieces
// @desc    List set pieces, optionally filtered by grade level, exam year,
//          or category
router.get('/', async (req, res) => {
  try {
    const { gradeLevel, examYear, category } = req.query;
    const filter = {};
    if (gradeLevel) filter.gradeLevel = gradeLevel;
    if (examYear) filter.examYear = examYear;
    if (category) filter.category = category;

    const setPieces = await SetPiece.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: setPieces.length, data: setPieces });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/setpieces/:id
router.get('/:id', async (req, res) => {
  try {
    const setPiece = await SetPiece.findById(req.params.id);
    if (!setPiece) {
      return res.status(404).json({ success: false, message: 'Set piece not found' });
    }
    res.status(200).json({ success: true, data: setPiece });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/setpieces
router.post('/', async (req, res) => {
  try {
    const newSetPiece = await SetPiece.create(req.body);
    res.status(201).json({ success: true, data: newSetPiece });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/setpieces/:id
router.put('/:id', async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    const updatedSetPiece = await SetPiece.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedSetPiece) {
      return res.status(404).json({ success: false, message: 'Set piece not found' });
    }
    res.status(200).json({ success: true, data: updatedSetPiece });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/setpieces/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedSetPiece = await SetPiece.findByIdAndDelete(req.params.id);
    if (!deletedSetPiece) {
      return res.status(404).json({ success: false, message: 'Set piece not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
