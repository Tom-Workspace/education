"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import AdminLayout from "../../../admin/_components/AdminLayout";

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId } = params;
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/admin/courses/${courseId}`);
        setCourse(response.data.course);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course details:", error);
        setError("Failed to load course details. Please try again.");
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-Olive-600"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!course) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p>Course not found.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <div className="flex space-x-3">
            <Link 
              href={`/admin/courses/${courseId}/content`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Manage Content
            </Link>
            <button 
              onClick={() => router.push(`/admin/courses/${courseId}/edit`)}
              className="bg-Olive-600 hover:bg-Olive-700 text-white px-4 py-2 rounded-md"
            >
              Edit Course
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-midNight-900 shadow-md rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-4 flex justify-center">
              <Image
                src={course.thumbnailUrl || "/images/default-course.jpg"}
                alt={course.title}
                width={300}
                height={200}
                className="rounded-md object-cover"
              />
            </div>
            <div className="md:w-2/3 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Course Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Status:</p>
                    <p className={`font-medium ${course.isPublished ? 'text-green-600' : 'text-red-600'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Price:</p>
                    <p className="font-medium">{course.isFree ? 'Free' : `$${course.price}`}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Total Videos:</p>
                    <p className="font-medium">{course.totalVideos || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Total Quizzes:</p>
                    <p className="font-medium">{course.totalQuizzes || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Total Duration:</p>
                    <p className="font-medium">{course.totalDuration || 0} minutes</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">Created:</p>
                    <p className="font-medium">{new Date(course.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-gray-700 dark:text-gray-300">{course.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          <div className="bg-white dark:bg-midNight-900 shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">Chapters</h3>
                <div className="text-3xl font-bold">{course.chapters?.length || 0}</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">Videos</h3>
                <div className="text-3xl font-bold">{course.totalVideos || 0}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">Quizzes</h3>
                <div className="text-3xl font-bold">{course.totalQuizzes || 0}</div>
              </div>
            </div>
            <div className="mt-6">
              <Link 
                href={`/admin/courses/${courseId}/content`}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
              >
                <span>Manage course content</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
