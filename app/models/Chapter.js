import mongoose from 'mongoose';

const ChapterSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a chapter title'],
    trim: true,
  },
  position: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
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

export default mongoose.models.Chapter || mongoose.model('Chapter', ChapterSchema);
