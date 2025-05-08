import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import mongoose from 'mongoose';
import Course from '@/app/models/Course';
import Chapter from '@/app/models/Chapter';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.email !== 'ahmedmohamedmmm39@gmail.com') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { courseId } = params;
    
    // Create a query that can handle both MongoDB ObjectId and numeric courseNum
    let query;
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      query = { _id: courseId };
    } else if (/^[0-9]+$/.test(courseId)) {
      query = { courseNum: parseInt(courseId) };
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

    // Get chapters for this course
    const chapters = await Chapter.find({ courseId: course._id }).sort({ position: 1 });
    
    // Add chapters to course object
    const courseWithChapters = {
      ...course.toObject(),
      chapters: chapters
    };

    return NextResponse.json({ course: courseWithChapters });
  } catch (error) {
    console.error('Error fetching course details:', error);
    return NextResponse.json(
      { message: 'Failed to fetch course details' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.email !== 'ahmedmohamedmmm39@gmail.com') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { courseId } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { message: 'Invalid course ID format' },
        { status: 400 }
      );
    }

    // Get request body
    const data = await request.json();
    
    // Update course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { 
        ...data,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ course: updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { message: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.email !== 'ahmedmohamedmmm39@gmail.com') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { courseId } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return NextResponse.json(
        { message: 'Invalid course ID format' },
        { status: 400 }
      );
    }

    // Delete course
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    // Note: In a real application, you would also delete related content
    // like chapters, videos, quizzes, etc. or implement a soft delete

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { message: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
