import dbConnect from '@/app/lib/dbConnect';
import Quiz from '@/app/models/Quiz';
import QuizQuestion from '@/app/models/QuizQuestion';
import Course from '@/app/models/Course';
import Chapter from '@/app/models/Chapter';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { courseId, quizId } = params;
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid ID format' 
      }, { status: 400 });
    }
    
    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ 
        success: false, 
        error: 'Quiz not found' 
      }, { status: 404 });
    }
    
    // Check if quiz belongs to the course
    if (quiz.courseId.toString() !== courseId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Quiz does not belong to this course' 
      }, { status: 400 });
    }
    
    // Get quiz questions
    const questions = await QuizQuestion.find({ quizId }).sort({ position: 1 });
    
    return NextResponse.json({ 
      success: true, 
      quiz,
      questions
    });
    
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch quiz', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { courseId, quizId } = params;
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid ID format' 
      }, { status: 400 });
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
    
    if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'At least one question is required' 
      }, { status: 400 });
    }
    
    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ 
        success: false, 
        error: 'Quiz not found' 
      }, { status: 404 });
    }
    
    // Check if quiz belongs to the course
    if (quiz.courseId.toString() !== courseId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Quiz does not belong to this course' 
      }, { status: 400 });
    }
    
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Update quiz
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        {
          title: data.title,
          description: data.description || '',
          timeLimit: data.timeLimit || 30,
          passingScore: data.passingScore || 70,
          maxAttempts: data.maxAttempts || 1,
          allowResume: data.allowResume || false,
          position: data.position || quiz.position,
          updatedAt: new Date()
        },
        { new: true, session }
      );
      
      // Delete existing questions
      await QuizQuestion.deleteMany({ quizId }, { session });
      
      // Create and save new questions
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
          quizId: quizId,
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
        message: 'Quiz updated successfully',
        quiz: {
          ...updatedQuiz.toObject(),
          questions
        }
      });
      
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
    
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to update quiz', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    // Connect to the database
    await dbConnect();
    
    const { courseId, quizId } = params;
    
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(quizId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid ID format' 
      }, { status: 400 });
    }
    
    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json({ 
        success: false, 
        error: 'Quiz not found' 
      }, { status: 404 });
    }
    
    // Check if quiz belongs to the course
    if (quiz.courseId.toString() !== courseId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Quiz does not belong to this course' 
      }, { status: 400 });
    }
    
    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Delete quiz questions
      await QuizQuestion.deleteMany({ quizId }, { session });
      
      // Delete quiz
      await Quiz.findByIdAndDelete(quizId, { session });
      
      // Commit the transaction
      await session.commitTransaction();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Quiz deleted successfully'
      });
      
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();
      throw error;
    } finally {
      // End the session
      session.endSession();
    }
    
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to delete quiz', 
      details: error.message 
    }, { status: 500 });
  }
}
