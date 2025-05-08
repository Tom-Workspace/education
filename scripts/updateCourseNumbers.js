// import mongoose from 'mongoose';
import Course from '../app/models/Course.js';
import dbConnect from '../app/lib/dbConnect.js';

async function updateCourseNumbers() {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Get all courses
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses`);

    // Update each course with a courseNum if it doesn't have one
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      if (!course.courseNum) {
        // Assign a courseNum equal to i+1 (starting from 1)
        await Course.findByIdAndUpdate(course._id, { courseNum: i + 1 });
        console.log(`Updated course ${course.title} with courseNum ${i + 1}`);
      }
    }

    console.log('Course numbers updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating course numbers:', error);
    process.exit(1);
  }
}

updateCourseNumbers();
