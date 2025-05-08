import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '@/app/lib/dbConnect';

// Helper function to ensure directory exists
async function ensureDirectoryExists(directory) {
  try {
    const fs = await import('fs');
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  } catch (error) {
    console.error('Error creating directory:', error);
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
    
    const formData = await request.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'course'; // Default to course, can be 'course', 'video', etc.
    
    if (!file) {
      return NextResponse.json(
        { message: 'No file provided' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create a unique filename
    const originalName = file.name;
    const extension = path.extname(originalName);
    const fileName = `${uuidv4()}${extension}`;
    
    // Define the upload directory based on type
    let uploadDir;
    if (type === 'video') {
      uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    } else if (type === 'pdf') {
      uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
    } else {
      // Default to course images
      uploadDir = path.join(process.cwd(), 'public', 'uploads', 'courses');
    }
    
    // Ensure the directory exists
    await ensureDirectoryExists(uploadDir);
    
    // Write the file
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);
    
    // Return the relative URL to the file
    const fileUrl = `/uploads/${type === 'video' ? 'videos' : type === 'pdf' ? 'pdfs' : 'courses'}/${fileName}`;
    
    return NextResponse.json({ 
      message: 'File uploaded successfully',
      url: fileUrl,
      fileName: fileName
    });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { message: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
