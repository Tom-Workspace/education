import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import mongoose from 'mongoose';
import Course from '@/app/models/Course';
import Video from '@/app/models/Video';
import Quiz from '@/app/models/Quiz';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { courseId } = params;
    
    // Create a query that can handle both numeric courseNum and MongoDB ObjectId
    let query;
    if (/^[0-9]+$/.test(courseId)) {
      // If courseId is numeric, use it as courseNum
      query = { courseNum: parseInt(courseId) };
    } else if (mongoose.Types.ObjectId.isValid(courseId)) {
      // If it's a valid ObjectId, use it as _id
      query = { _id: courseId };
    } else {
      return NextResponse.json(
        { message: 'Invalid course ID format' },
        { status: 400 }
      );
    }

    // Get course
    const course = await Course.findOne(query);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Calculate metrics
    const videos = await Video.find({ courseId: course._id });
    const quizzes = await Quiz.find({ courseId: course._id });
    
    const totalVideos = videos.length;
    const totalQuizzes = quizzes.length;
    
    // Calculate total duration in minutes
    let totalDuration = 0;
    videos.forEach(video => {
      if (video.duration) {
        totalDuration += video.duration;
      }
    });
    
    // Update course with new metrics
    course.totalVideos = totalVideos;
    course.totalQuizzes = totalQuizzes;
    course.totalDuration = totalDuration;
    course.updatedAt = new Date();
    
    await course.save();
    
    return NextResponse.json({
      success: true,
      metrics: {
        totalVideos,
        totalQuizzes,
        totalDuration
      }
    });
  } catch (error) {
    console.error('Error updating course metrics:', error);
    return NextResponse.json(
      { message: 'Failed to update course metrics', error: error.message },
      { status: 500 }
    );
  }
}
