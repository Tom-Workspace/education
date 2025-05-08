import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import User from '@/app/models/User';
import Course from '@/app/models/Course';
import mongoose from 'mongoose';

// Get user's subscribed courses
export async function GET() {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Find the user with populated subscriptions
    const user = await User.findOne({ email: session.user.email })
      .populate({
        path: 'subscriptions.courseId',
        select: '_id title description thumbnailUrl price courseNum createdAt'
      });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      subscriptions: user.subscriptions || [] 
    });
    
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { message: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

// Subscribe to a course
export async function POST(request) {
  try {
    const session = await getServerSession();
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    
    // Get the course ID from the request body
    const data = await request.json();
    const { courseId } = data;
    
    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    // Verify the course exists
    let course;
    
    try {
      if (mongoose.Types.ObjectId.isValid(courseId)) {
        course = await Course.findById(courseId);
      } else if (typeof courseId === 'number' || /^\d+$/.test(courseId)) {
        // Try with courseNum if it's a number
        course = await Course.findOne({ courseNum: parseInt(courseId) });
      } else {
        return NextResponse.json(
          { message: 'Invalid course ID format' },
          { status: 400 }
        );
      }
    } catch (err) {
      console.error('Error finding course:', err);
      return NextResponse.json(
        { message: 'Error finding course' },
        { status: 500 }
      );
    }
    
    if (!course) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }
    
    // Find the user
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if already subscribed
    const isSubscribed = user.subscriptions && user.subscriptions.some(
      sub => sub.courseId.toString() === course._id.toString()
    );
    
    if (isSubscribed) {
      return NextResponse.json(
        { message: 'Already subscribed to this course' },
        { status: 400 }
      );
    }
    
    // Add subscription
    if (!user.subscriptions) {
      user.subscriptions = [];
    }
    
    user.subscriptions.push({
      courseId: course._id,
      subscribedAt: new Date()
    });
    
    await user.save();
    
    return NextResponse.json({ 
      message: 'Successfully subscribed to course',
      subscription: {
        courseId: course._id,
        courseDetails: {
          _id: course._id,
          title: course.title,
          description: course.description,
          thumbnailUrl: course.thumbnailUrl,
          price: course.price,
          courseNum: course.courseNum
        },
        subscribedAt: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error subscribing to course:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe to course' },
      { status: 500 }
    );
  }
}
