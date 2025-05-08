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
    console.log('Submit API: Session data:', JSON.stringify(session, null, 2));
    
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Extract user identifier from session - use email if ID is not available
    let userId = session.user.id || session.user.sub || session.user._id;
    const userEmail = session.user.email;
    
    if (!userId && !userEmail) {
      console.error('Submit API: Cannot find user ID or email in session:', session);
      return NextResponse.json(
        { message: 'User identifier not found in session' },
        { status: 400 }
      );
    }
    
    // If no ID is available, use email as the identifier
    if (!userId && userEmail) {
      userId = userEmail;
      console.log('Submit API: Using email as user identifier:', userId);
    } else {
      console.log('Submit API: Using ID as user identifier:', userId);
    }

    await dbConnect();
    const { quizId } = params;
    const { answers } = await request.json();
    
    // Check if user has already completed this quiz
    const existingAttempt = await QuizAttempt.findOne({
      userId: userId,
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
        userId: userId,
        quizId: quizId
      });
      
      // Default to 1 if maxAttempts is not defined
      const maxAttempts = quiz.maxAttempts || 1;
      
      console.log('Submit API: Attempt count:', attemptCount, 'Max attempts:', maxAttempts);
      
      if (attemptCount >= maxAttempts) {
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

    // Create a new quiz attempt record
    const quizAttempt = new QuizAttempt({
      userId: userId,
      quizId: quizId,
      courseId: quiz.courseId,
      answers: processedAnswers,
      score: score,
      totalQuestions: questions.length,
      completedAt: new Date(),
      isCompleted: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await quizAttempt.save();
    
    console.log('Submit API: Created new quiz attempt:', quizAttempt._id);

    // Update user progress
    await UserProgress.findOneAndUpdate(
      { 
        userId: userId, 
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
    // const userProgress = await UserProgress.findOne({ 
    //   userId: session.user.id, 
    //   courseId: quiz.courseId 
    // });

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
