import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Video from '@/app/models/Video';
import Chapter from '@/app/models/Chapter';
import Course from '@/app/models/Course';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { videoId } = params;

    // Get video details
    const video = await Video.findById(videoId);
    if (!video) {
      return NextResponse.json(
        { message: 'Video not found' },
        { status: 404 }
      );
    }

    // Get chapter and course info
    const chapter = await Chapter.findById(video.chapterId);
    const course = await Course.findById(video.courseId);

    // Get next and previous videos in the same chapter
    const chapterVideos = await Video.find({ 
      chapterId: video.chapterId 
    }).sort({ position: 1 });

    const currentIndex = chapterVideos.findIndex(
      v => v._id.toString() === videoId
    );

    const previousVideo = currentIndex > 0 
      ? chapterVideos[currentIndex - 1] 
      : null;
      
    const nextVideo = currentIndex < chapterVideos.length - 1 
      ? chapterVideos[currentIndex + 1] 
      : null;

    return NextResponse.json({
      video,
      chapter,
      course,
      navigation: {
        previous: previousVideo,
        next: nextVideo
      }
    });
  } catch (error) {
    console.error('Error fetching video:', error);
    return NextResponse.json(
      { message: 'Failed to fetch video data' },
      { status: 500 }
    );
  }
}
