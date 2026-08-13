const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * ArchiveItem
 * Represents a single entry in the Centralized Cultural Repository:
 * a traditional Kenyan folk song or an indigenous instrument, categorized
 * by tribe of origin and cultural occasion, as specified in the Chapter 4
 * ERD and Class Diagram for SautiSmart.
 */
const ArchiveItemSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  itemType: {
    type: String,
    enum: ['Folk Song', 'Indigenous Instrument'],
    required: [true, 'Item type is required'],
  },
  tribeOfOrigin: {
    type: String,
    required: [true, 'Tribe of origin is required'],
    trim: true,
  },
  region: {
    type: String,
    trim: true,
    default: '',
  },
  culturalOccasion: {
    type: String,
    required: [true, 'Cultural occasion is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  culturalSignificance: {
    type: String,
    default: '',
  },
  audioUrl: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  lyrics: {
    type: String,
    default: '',
  },
  instrumentFamily: {
    type: String,
    enum: ['String', 'Wind', 'Percussion', 'Membranophone', 'Idiophone', 'N/A'],
    default: 'N/A',
  },
  gradeLevel: [
    {
      type: String,
      enum: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    },
  ],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ArchiveItemSchema.pre('save', function preSave(next) {
  this.updatedAt = Date.now();
  next();
});

ArchiveItemSchema.index({ tribeOfOrigin: 1, culturalOccasion: 1 });
ArchiveItemSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.models.ArchiveItem || mongoose.model('ArchiveItem', ArchiveItemSchema);
