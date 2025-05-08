import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  courseNum: {
    type: Number,
    unique: true,
    sparse: true, // Allows null/undefined values (for backward compatibility)
  },
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description'],
  },
  thumbnailUrl: {
    type: String,
    default: '/images/default-course.jpg',
  },
  price: {
    type: Number,
    default: 0,
  },
  isFree: {
    type: Boolean,
    default: true,
  },
  totalVideos: {
    type: Number,
    default: 0,
  },
  totalQuizzes: {
    type: Number,
    default: 0,
  },
  totalDuration: {
    type: Number, // in minutes
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
  isPublished: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
