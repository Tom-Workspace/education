import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import Quiz from '@/app/models/Quiz';
import QuizQuestion from '@/app/models/QuizQuestion';
import QuizAttempt from '@/app/models/QuizAttempt';
import UserProgress from '@/app/models/UserProgress';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { quizId } = params;
    const { answers } = await request.json();
    
    // Check if user has already completed this quiz
    const existingAttempt = await QuizAttempt.findOne({
      userId: session.user.id,
      quizId: quizId,
      isCompleted: true
    });

    // Get quiz details
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }
    
    // Check if user has exceeded maximum attempts
    if (existingAttempt) {
      // Count total attempts
      const attemptCount = await QuizAttempt.countDocuments({
        userId: session.user.id,
        quizId: quizId
      });
      
      if (attemptCount >= quiz.maxAttempts) {
        return NextResponse.json(
          { 
            success: false,
            message: 'You have reached the maximum number of attempts for this quiz',
            existingAttempt: existingAttempt
          },
          { status: 403 }
        );
      }
    }

    // Get all quiz questions
    const questions = await QuizQuestion.find({ quizId });
    
    // Calculate score
    let score = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (!question) continue;

      const isCorrect = question.options[answer.selectedOption]?.isCorrect || false;
      if (isCorrect) score++;

      processedAnswers.push({
        questionId: answer.questionId,
        selectedOption: answer.selectedOption,
        isCorrect
      });
    }

    // Create or update quiz attempt
    const quizAttempt = await QuizAttempt.findOneAndUpdate(
      { 
        userId: session.user.id, 
        quizId: quizId 
      },
      {
        userId: session.user.id,
        quizId: quizId,
        courseId: quiz.courseId,
        answers: processedAnswers,
        score: score,
        totalQuestions: questions.length,
        completedAt: new Date(),
        isCompleted: true,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true 
      }
    );

    // Update user progress
    await UserProgress.findOneAndUpdate(
      { 
        userId: session.user.id, 
        courseId: quiz.courseId 
      },
      {
        $addToSet: { completedQuizzes: quizId },
        lastAccessedAt: new Date(),
        updatedAt: new Date()
      },
      { 
        upsert: true 
      }
    );

    // Calculate and update overall progress
    const userProgress = await UserProgress.findOne({ 
      userId: session.user.id, 
      courseId: quiz.courseId 
    });

    return NextResponse.json({
      success: true,
      score,
      totalQuestions: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      answers: processedAnswers
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { message: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}
