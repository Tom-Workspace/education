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
    console.log('API: Connecting to database...');
    await dbConnect();
    console.log('API: Database connected');
    
    const session = await getServerSession();
    console.log('API: Session retrieved:', session ? 'User is logged in' : 'No user session');
    
    const { quizId } = params;
    console.log('API: Fetching quiz with ID:', quizId);

    // Get quiz details
    const quiz = await Quiz.findById(quizId).catch(err => {
      console.error('API: Error finding quiz by ID:', err.message);
      return null;
    });
    
    console.log('API: Quiz found?', !!quiz);
    
    if (!quiz) {
      console.log('API: Quiz not found, returning 404');
      return NextResponse.json(
        { message: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get quiz questions
    console.log('API: Fetching quiz questions for quizId:', quizId);
    const questions = await QuizQuestion.find({ quizId }).sort({ position: 1 }).catch(err => {
      console.error('API: Error finding quiz questions:', err.message);
      return [];
    });
    console.log(`API: Found ${questions.length} questions`);
    
    // Get chapter and course info
    console.log('API: Fetching chapter with ID:', quiz.chapterId);
    const chapter = await Chapter.findById(quiz.chapterId).catch(err => {
      console.error('API: Error finding chapter:', err.message);
      return null;
    });
    console.log('API: Chapter found?', !!chapter);
    
    console.log('API: Fetching course with ID:', quiz.courseId);
    const course = await Course.findById(quiz.courseId).catch(err => {
      console.error('API: Error finding course:', err.message);
      return null;
    });
    console.log('API: Course found?', !!course);

    // Check for previous attempts if user is logged in
    let previousAttempt = null;
    let attemptsCount = 0;
    
    if (session?.user) {
      // Extract user identifier from session - use email if ID is not available
      let userId = session.user.id || session.user.sub || session.user._id;
      const userEmail = session.user.email;
      
      if (!userId && userEmail) {
        userId = userEmail;
        console.log('API: Using email as user identifier:', userId);
      } else if (userId) {
        console.log('API: Using ID as user identifier:', userId);
      } else {
        console.log('API: No user identifier found in session');
        userId = null;
      }
      
      if (userId) {
        try {
          // Find the most recent completed attempt
          previousAttempt = await QuizAttempt.findOne({
            userId: userId,
            quizId: quizId,
            isCompleted: true
          }).sort({ completedAt: -1 });
          
          console.log('API: Previous attempt found?', !!previousAttempt);
          
          // Count total attempts
          attemptsCount = await QuizAttempt.countDocuments({
            userId: userId,
            quizId: quizId
          });
          
          console.log('API: Total attempts count:', attemptsCount);
        } catch (err) {
          console.error('API: Error checking previous attempts:', err.message);
        }
      }
    } else {
      console.log('API: No user session, skipping previous attempts check');
    }
    
    console.log('API: Preparing response with quiz data');
    const response = {
      quiz,
      questions,
      chapter,
      course,
      previousAttempt,
      attemptsCount
    };
    
    console.log('API: Successfully prepared quiz data response');
    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error fetching quiz:', error.message);
    console.error('API Error stack:', error.stack);
    return NextResponse.json(
      { 
        message: 'Failed to fetch quiz data', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
