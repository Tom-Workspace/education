import dbConnect from '@/app/lib/dbConnect';
import PdfResource from '@/app/models/PdfResource';
import Course from '@/app/models/Course';
import Chapter from '@/app/models/Chapter';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

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
    
    // Handle form data for file upload
    const formData = await request.formData();
    const title = formData.get('title');
    const description = formData.get('description') || '';
    const chapterId = formData.get('chapterId');
    const position = formData.get('position') || 1;
    const file = formData.get('file');
    
    // Validate required fields
    if (!title) {
      return NextResponse.json({ 
        success: false, 
        error: 'PDF title is required' 
      }, { status: 400 });
    }
    
    if (!chapterId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Chapter ID is required' 
      }, { status: 400 });
    }
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'PDF file is required' 
      }, { status: 400 });
    }
    
    // Validate chapter exists
    if (!mongoose.Types.ObjectId.isValid(chapterId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid chapter ID' 
      }, { status: 400 });
    }
    
    const chapter = await Chapter.findById(chapterId);
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
    
    // Process the file
    const fileName = file.name;
    const fileType = file.type;
    
    if (fileType !== 'application/pdf') {
      return NextResponse.json({ 
        success: false, 
        error: 'Only PDF files are allowed' 
      }, { status: 400 });
    }
    
    // Generate a unique filename to avoid collisions
    const uniqueFileName = `${Date.now()}-${fileName.replace(/\s+/g, '-')}`;
    
    // Define the upload directory and file path
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'pdfs');
    const filePath = path.join(uploadDir, uniqueFileName);
    
    // Ensure the upload directory exists
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (error) {
      console.error('Error creating upload directory:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create upload directory' 
      }, { status: 500 });
    }
    
    // Convert the file to an ArrayBuffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write the file to the filesystem
    try {
      await writeFile(filePath, buffer);
      console.log(`File saved to ${filePath}`);
    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to save file' 
      }, { status: 500 });
    }
    
    // Create the URL for the PDF
    const pdfUrl = `/uploads/pdfs/${uniqueFileName}`;
    
    // Create new PDF resource
    const newPdf = new PdfResource({
      courseId,
      chapterId,
      title,
      description,
      pdfUrl, // Use the correct field name for the model
      fileName,
      position: parseInt(position),
      isPublished: false
    });
    
    // Save the PDF resource
    await newPdf.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'PDF created successfully',
      pdf: newPdf
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating PDF:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to create PDF', 
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
    
    // Fetch PDFs for the course
    const pdfs = await PdfResource.find({ courseId }).sort({ position: 1 });
    
    return NextResponse.json({ 
      success: true, 
      pdfs
    });
    
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch PDFs', 
      details: error.message 
    }, { status: 500 });
  }
}
