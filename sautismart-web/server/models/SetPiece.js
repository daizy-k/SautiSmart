const mongoose = require('mongoose');

const { Schema } = mongoose;

/**
 * Stem sub-document.
 * Each stem is an isolated audio track (e.g. Soprano, Alto, Tenor, Bass,
 * Drums, Nyatiti) that the Web Audio API engine in AudioPlayer.js loads
 * independently so a learner can mute/solo or adjust the volume of a
 * single part while practicing a SetPiece.
 */
const StemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Stem name is required'],
      trim: true,
    },
    instrument: {
      type: String,
      required: [true, 'Instrument or voice part is required'],
      trim: true,
    },
    audioUrl: {
      type: String,
      required: [true, 'Stem audio URL is required'],
    },
    defaultVolume: {
      type: Number,
      min: 0,
      max: 1.5,
      default: 1,
    },
  },
  { _id: false }
);

/**
 * SetPiece
 * Represents a syllabus set piece (choral, instrumental, or set-book song)
 * that learners practice using the tempo-manipulation and stem-isolation
 * features of the Web Audio API engine, per the Chapter 4 Class Diagram.
 */
const SetPieceSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  composer: {
    type: String,
    trim: true,
    default: 'Traditional',
  },
  gradeLevel: {
    type: String,
    enum: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    required: [true, 'Grade level is required'],
  },
  examYear: {
    type: Number,
  },
  category: {
    type: String,
    enum: ['Choral', 'Instrumental', 'Set Book Song', 'Folk Fusion', 'Other'],
    default: 'Other',
  },
  description: {
    type: String,
    default: '',
  },
  originalTempoBpm: {
    type: Number,
    default: 100,
  },
  keySignature: {
    type: String,
    default: 'C Major',
  },
  timeSignature: {
    type: String,
    default: '4/4',
  },
  difficultyLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  stems: {
    type: [StemSchema],
    default: [],
  },
  fullMixAudioUrl: {
    type: String,
    default: '',
  },
  sheetMusicUrl: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

SetPieceSchema.pre('save', function preSave(next) {
  this.updatedAt = Date.now();
  next();
});

SetPieceSchema.index({ gradeLevel: 1, examYear: 1 });

module.exports = mongoose.models.SetPiece || mongoose.model('SetPiece', SetPieceSchema);
