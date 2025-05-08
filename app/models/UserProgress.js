import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // Allow both ObjectId and String
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
  }],
  completedQuizzes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz'
  }],
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number, // Percentage of course completed
    default: 0
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

// Create a compound index to ensure a user can only have one progress record per course
UserProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);
