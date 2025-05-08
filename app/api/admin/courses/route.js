import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/app/lib/dbConnect';
import Course from '@/app/models/Course';

export async function GET() {
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
    
    // Get all courses
    const courses = await Course.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
    
    const data = await request.json();
    
    // Create new course
    const course = await Course.create({
      title: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnailUrl,
      price: data.price || 0,
      isFree: data.isFree !== false,
      isPublished: data.isPublished || false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { message: 'Failed to create course' },
      { status: 500 }
    );
  }
}
