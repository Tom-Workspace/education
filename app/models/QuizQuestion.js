import mongoose from 'mongoose';

const QuizQuestionSchema = new mongoose.Schema({
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  question: {
    type: String,
    required: [true, 'Please provide a question'],
  },
  imageUrl: {
    type: String,
    default: null // Optional image for the question
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  position: {
    type: Number,
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

export default mongoose.models.QuizQuestion || mongoose.model('QuizQuestion', QuizQuestionSchema);
