import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import Quiz from '@/app/models/Quiz';
import QuizQuestion from '@/app/models/QuizQuestion';
import QuizAttempt from '@/app/models/QuizAttempt';
import Course from '@/app/models/Course';
import Chapter from '@/app/models/Chapter';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession();
    const { quizId } = params;

    // Get quiz details
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get quiz questions
    const questions = await QuizQuestion.find({ quizId }).sort({ position: 1 });
    
    // Get chapter and course info
    const chapter = await Chapter.findById(quiz.chapterId);
    const course = await Course.findById(quiz.courseId);

    // Check for previous attempts if user is logged in
    let previousAttempt = null;
    let attemptsCount = 0;
    
    if (session?.user) {
      // Find the most recent completed attempt
      previousAttempt = await QuizAttempt.findOne({
        userId: session.user.id,
        quizId: quizId,
        isCompleted: true
      }).sort({ completedAt: -1 });
      
      // Count total attempts
      attemptsCount = await QuizAttempt.countDocuments({
        userId: session.user.id,
        quizId: quizId
      });
    }
    
    return NextResponse.json({
      quiz,
      questions,
      chapter,
      course,
      previousAttempt,
      attemptsCount
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { message: 'Failed to fetch quiz data' },
      { status: 500 }
    );
  }
}
