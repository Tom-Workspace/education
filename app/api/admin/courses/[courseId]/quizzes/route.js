import dbConnect from '@/app/lib/dbConnect';
import Quiz from '@/app/models/Quiz';
import QuizQuestion from '@/app/models/QuizQuestion';
import Course from '@/app/models/Course';
import Chapter from '@/app/models/Chapter';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function POST(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { courseId } = params;
    
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid course ID' 
      }, { status: 400 });
    }
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ 
        success: false, 
        error: 'Course not found' 
      }, { status: 404 });
    }
    
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.title) {
      return NextResponse.json({ 
        success: false, 
        error: 'Quiz title is required' 
      }, { status: 400 });
    }
    
    if (!data.chapterId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Chapter ID is required' 
      }, { status: 400 });
    }
    
    if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'At least one question is required' 
      }, { status: 400 });
    }
    
    // Validate chapter exists
    if (!mongoose.Types.ObjectId.isValid(data.chapterId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid chapter ID' 
      }, { status: 400 });
    }
    
    const chapter = await Chapter.findById(data.chapterId);
    if (!chapter) {
      return NextResponse.json({ 
        success: false, 
        error: 'Chapter not found' 
      }, { status: 404 });
    }
    
    // Ensure chapter belongs to the course
    if (chapter.courseId.toString() !== courseId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Chapter does not belong to this course' 
      }, { status: 400 });
    }
    
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create new quiz
      const newQuiz = new Quiz({
        courseId,
        chapterId: data.chapterId,
        title: data.title,
        description: data.description || '',
        timeLimit: data.timeLimit || 30,
        passingScore: data.passingScore || 70,
        maxAttempts: data.maxAttempts || 1,
        allowResume: data.allowResume || false,
        position: data.position || 1,
        isPublished: false
      });
      
      // Save the quiz
      await newQuiz.save({ session });
      
      // Create and save questions
      const questions = [];
      
      for (const questionData of data.questions) {
        if (!questionData.question || !questionData.options || !Array.isArray(questionData.options)) {
          throw new Error('Invalid question format');
        }
        
        // Format options as objects with text and isCorrect properties
        const formattedOptions = questionData.options.map((option, index) => ({
          text: option,
          isCorrect: index === (questionData.correctOption || 0)
        }));
        
        const newQuestion = new QuizQuestion({
          quizId: newQuiz._id,
          question: questionData.question,
          options: formattedOptions,
          position: questionData.position || 0,
          points: questionData.points || 1
        });
        
        await newQuestion.save({ session });
        questions.push(newQuestion);
      }
      
      // Commit the transaction
      await session.commitTransaction();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Quiz created successfully',
        quiz: {
          ...newQuiz.toObject(),
          questions
        }
      }, { status: 201 });
      
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
    
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create quiz', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { courseId } = params;
    
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid course ID' 
      }, { status: 400 });
    }
    
    // Fetch quizzes for the course
    const quizzes = await Quiz.find({ courseId }).sort({ position: 1 });
    
    // Fetch questions for each quiz
    const quizzesWithQuestions = await Promise.all(
      quizzes.map(async (quiz) => {
        const questions = await QuizQuestion.find({ quizId: quiz._id });
        return {
          ...quiz.toObject(),
          questions
        };
      })
    );
    
    return NextResponse.json({ 
      success: true, 
      quizzes: quizzesWithQuestions
    });
    
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch quizzes', 
      details: error.message 
    }, { status: 500 });
  }
}
