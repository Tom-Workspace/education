"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "../../_components/NavBar";
import Presesnt from '../../_components/cource/presesnt';
import axios from "axios";
import Link from "next/link";

const CoursePage = () => {
  const params = useParams();
  const courseId = params.courseNum;
  
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        
        // Use Promise.all to make concurrent API requests for faster loading
        const [courseResponse, metricsResponse] = await Promise.all([
          axios.get(`/api/courses/${courseId}`),
          axios.get(`/api/courses/${courseId}/update-metrics`) // Update and fetch latest metrics
        ]);
        
        // Combine the course data with the fresh metrics
        const courseData = courseResponse.data.course;
        if (metricsResponse.data.success) {
          courseData.totalVideos = metricsResponse.data.metrics.totalVideos;
          courseData.totalQuizzes = metricsResponse.data.metrics.totalQuizzes;
          courseData.totalDuration = metricsResponse.data.metrics.totalDuration;
        }
        
        setCourse(courseData);
        setChapters(courseResponse.data.chapters);
        
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('فشل في تحميل بيانات الكورس. يرجى المحاولة مرة أخرى');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const toggleChapter = (chapterId) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="bg-red-100 p-4 rounded-md text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Course Header/Banner */}
      <Presesnt course={course} />
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-right">محتوى الكورس</h2>
        
        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-md text-center">
            <h3 className="font-bold text-lg mb-2">عدد الفيديوهات</h3>
            <p className="text-3xl font-bold text-blue-600">{course?.totalVideos || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-md text-center">
            <h3 className="font-bold text-lg mb-2">عدد ساعات المشاهدة</h3>
            <p className="text-3xl font-bold text-green-600">
              {course?.totalDuration ? `${Math.floor(course.totalDuration / 60)} ساعة و ${course.totalDuration % 60} دقيقة` : '0 ساعة و 0 دقيقة'}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-md text-center">
            <h3 className="font-bold text-lg mb-2">عدد الاختبارات</h3>
            <p className="text-3xl font-bold text-yellow-600">{course?.totalQuizzes || 0}</p>
          </div>
        </div>
        
        {/* Chapters Accordion */}
        <div className="space-y-4">
          {chapters.length > 0 ? (
            chapters.map((chapter) => (
              <div key={chapter._id} className="border rounded-lg overflow-hidden">
                <div 
                  className="bg-gray-100 p-4 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleChapter(chapter._id)}
                >
                  <div className="font-bold text-lg">{chapter.title}</div>
                  <div className="transform transition-transform duration-200">
                    {expandedChapter === chapter._id ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </div>
                </div>
                
                {expandedChapter === chapter._id && (
                  <div className="p-4 bg-white">
                    {/* Videos */}
                    {chapter.videos && chapter.videos.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-bold mb-2">الفيديوهات</h3>
                        <div className="space-y-2">
                          {chapter.videos.map((video) => (
                            <Link 
                              href={`/course/${courseId}/video/${video._id}`}
                              key={video._id}
                            >
                              <div className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                                <div className="mr-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                  </svg>
                                </div>
                                <div className="flex-1">{video.title}</div>
                                <div className="text-sm text-gray-500">
                                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* PDFs */}
                    {chapter.pdfs && chapter.pdfs.length > 0 && (
                      <div className="mb-4">
                        <h3 className="font-bold mb-2">ملفات PDF</h3>
                        <div className="space-y-2">
                          {chapter.pdfs.map((pdf) => (
                            <a 
                              href={pdf.pdfUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              key={pdf._id} 
                              className="flex items-center p-2 hover:bg-gray-50 rounded-md"
                            >
                              <div className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="flex-1">{pdf.title}</div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Quizzes */}
                    {chapter.quizzes && chapter.quizzes.length > 0 && (
                      <div>
                        <h3 className="font-bold mb-2">الاختبارات</h3>
                        <div className="space-y-2">
                          {chapter.quizzes.map((quiz) => (
                            <Link 
                              href={`/course/${courseId}/quiz/${quiz._id}`}
                              key={quiz._id}
                            >
                              <div className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                                <div className="mr-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="flex-1">{quiz.title}</div>
                                {quiz.timeLimit > 0 && (
                                  <div className="text-sm text-gray-500">
                                    {quiz.timeLimit} دقيقة
                                  </div>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-gray-500">
              لا يوجد محتوى متاح لهذا الكورس حالياً
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
