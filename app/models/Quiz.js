import mongoose from 'mongoose';

const QuizSchema = new mongoose.Schema({
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a quiz title'],
    trim: true,
  },
  description: {
    type: String,
    default: ''
  },
  timeLimit: {
    type: Number, // in minutes
    default: 0 // 0 means no time limit
  },
  allowLaterCompletion: {
    type: Boolean,
    default: false
  },
  maxAttempts: {
    type: Number,
    default: 1 // Default to 1 attempt allowed
  },
  position: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.models.Quiz || mongoose.model('Quiz', QuizSchema);
