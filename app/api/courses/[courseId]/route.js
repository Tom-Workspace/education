import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import mongoose from 'mongoose';
import Course from '@/app/models/Course';
import Chapter from '@/app/models/Chapter';
import Video from '@/app/models/Video';
import PdfResource from '@/app/models/PdfResource';
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

    // Get course details
    const course = await Course.findOne(query);
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Get chapters with their content
    const chapters = await Chapter.find({ courseId: course._id }).sort({ position: 1 });
    
    // Get all course content
    const videos = await Video.find({ courseId: course._id }).sort({ position: 1 });
    const pdfs = await PdfResource.find({ courseId: course._id }).sort({ position: 1 });
    const quizzes = await Quiz.find({ courseId: course._id }).sort({ position: 1 });

    // Organize content by chapter
    const chaptersWithContent = chapters.map(chapter => {
      const chapterVideos = videos.filter(
        video => video.chapterId.toString() === chapter._id.toString()
      );
      
      const chapterPdfs = pdfs.filter(
        pdf => pdf.chapterId.toString() === chapter._id.toString()
      );
      
      const chapterQuizzes = quizzes.filter(
        quiz => quiz.chapterId.toString() === chapter._id.toString()
      );

      return {
        ...chapter.toObject(),
        videos: chapterVideos,
        pdfs: chapterPdfs,
        quizzes: chapterQuizzes
      };
    });

    return NextResponse.json({
      course,
      chapters: chaptersWithContent
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { message: 'Failed to fetch course data' },
      { status: 500 }
    );
  }
}
