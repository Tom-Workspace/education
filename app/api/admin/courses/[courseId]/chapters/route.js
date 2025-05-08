import dbConnect from '@/app/lib/dbConnect';
import Chapter from '@/app/models/Chapter';
import Course from '@/app/models/Course';
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
        error: 'Chapter title is required' 
      }, { status: 400 });
    }
    
    // Create new chapter
    const newChapter = new Chapter({
      courseId,
      title: data.title,
      description: data.description || '',
      position: data.position || 1,
      isPublished: false
    });
    
    // Save the chapter
    await newChapter.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Chapter created successfully',
      chapter: newChapter
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating chapter:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create chapter', 
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
    
    // Fetch chapters for the course
    const chapters = await Chapter.find({ courseId }).sort({ position: 1 });
    
    return NextResponse.json({ 
      success: true, 
      chapters
    });
    
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch chapters', 
      details: error.message 
    }, { status: 500 });
  }
}
