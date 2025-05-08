import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Course from '@/app/models/Course';

export async function GET(request) {
  try {
    await dbConnect();
    
    // Parse query parameters for pagination
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    // Only get necessary fields for better performance
    const courseProjection = {
      _id: 1,
      title: 1,
      description: 1,
      thumbnailUrl: 1,
      price: 1,
      courseNum: 1,
      createdAt: 1
    };
    
    // Use Promise.all to run queries in parallel
    const [courses, totalCount] = await Promise.all([
      Course.find({}, courseProjection)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean() for better performance when we don't need Mongoose document methods
      
      // Only count on first page to improve performance
      page === 1 ? Course.countDocuments({}) : Promise.resolve(0)
    ]);
    
    return NextResponse.json({ 
      courses,
      pagination: {
        page,
        limit,
        totalCount: page === 1 ? totalCount : null, // Only send count on first page
        hasMore: courses.length === limit
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { message: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}
