import dbConnect from '@/app/lib/dbConnect';
import Video from '@/app/models/Video';
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
        error: 'Video title is required' 
      }, { status: 400 });
    }
    
    if (!data.videoUrl && !data.url) {
      return NextResponse.json({ 
        success: false, 
        error: 'Video URL is required' 
      }, { status: 400 });
    }
    
    // Ensure we're using the correct field name for the model
    const videoUrl = data.videoUrl || data.url;
    
    if (!data.chapterId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Chapter ID is required' 
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
    
    // Create new video
    const newVideo = new Video({
      courseId,
      chapterId: data.chapterId,
      title: data.title,
      description: data.description || '',
      videoUrl: videoUrl, // Use the correct field name for the model
      duration: data.duration || 0,
      position: data.position || 1,
      isPublished: false
    });
    
    // Save the video
    await newVideo.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Video created successfully',
      video: newVideo
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create video', 
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
    
    // Fetch videos for the course
    const videos = await Video.find({ courseId }).sort({ position: 1 });
    
    return NextResponse.json({ 
      success: true, 
      videos
    });
    
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch videos', 
      details: error.message 
    }, { status: 500 });
  }
}
