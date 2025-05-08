import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Quiz from '@/app/models/Quiz';

export async function GET() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected');

    // Find all quizzes that don't have maxAttempts field or where it's null
    const quizzesWithoutMaxAttempts = await Quiz.find({
      $or: [
        { maxAttempts: { $exists: false } },
        { maxAttempts: null }
      ]
    });

    console.log(`Found ${quizzesWithoutMaxAttempts.length} quizzes without maxAttempts field`);

    // Update all quizzes to have maxAttempts = 1
    if (quizzesWithoutMaxAttempts.length > 0) {
      const updateResult = await Quiz.updateMany(
        {
          $or: [
            { maxAttempts: { $exists: false } },
            { maxAttempts: null }
          ]
        },
        { $set: { maxAttempts: 1 } }
      );

      console.log(`Updated ${updateResult.modifiedCount} quizzes`);

      return NextResponse.json({
        success: true,
        message: `Updated ${updateResult.modifiedCount} quizzes with default maxAttempts value`,
        updatedCount: updateResult.modifiedCount
      });
    } else {
      return NextResponse.json({
        success: true,
        message: 'All quizzes already have maxAttempts field',
        updatedCount: 0
      });
    }
  } catch (error) {
    console.error('Error updating quiz schema:', error);
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update quiz schema',
        error: error.message
      },
      { status: 500 }
    );
  }
}
