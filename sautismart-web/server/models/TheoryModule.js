const mongoose = require('mongoose');

const { Schema } = mongoose;

const QuizQuestionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question text is required'],
    },
    options: {
      type: [String],
      validate: {
        validator: function validateOptions(options) {
          return Array.isArray(options) && options.length >= 2;
        },
        message: 'A quiz question requires at least two options',
      },
    },
    correctAnswerIndex: {
      type: Number,
      required: [true, 'Correct answer index is required'],
      min: 0,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const ResourceSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * TheoryModule
 * Represents a structured, syllabus-aligned music theory revision lesson
 * for a specific CBC grade level, strand, and sub-strand, as specified in
 * the Chapter 4 Class Diagram for SautiSmart.
 */
const TheoryModuleSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  gradeLevel: {
    type: String,
    enum: ['Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'],
    required: [true, 'Grade level is required'],
  },
  strand: {
    type: String,
    required: [true, 'CBC strand is required'],
    trim: true,
  },
  subStrand: {
    type: String,
    trim: true,
    default: '',
  },
  topic: {
    type: String,
    required: [true, 'Topic is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required'],
  },
  learningObjectives: {
    type: [String],
    default: [],
  },
  quizQuestions: {
    type: [QuizQuestionSchema],
    default: [],
  },
  resources: {
    type: [ResourceSchema],
    default: [],
  },
  order: {
    type: Number,
    default: 0,
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

TheoryModuleSchema.pre('save', function preSave(next) {
  this.updatedAt = Date.now();
  next();
});

TheoryModuleSchema.index({ gradeLevel: 1, order: 1 });

module.exports = mongoose.models.TheoryModule || mongoose.model('TheoryModule', TheoryModuleSchema);
