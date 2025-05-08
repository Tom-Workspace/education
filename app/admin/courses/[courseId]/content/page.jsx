"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import AdminLayout from "../../../_components/AdminLayout";
import EditQuizForm from "./EditQuizForm";

// Import components
import ChaptersManager from "./_components/ChaptersManager";
import VideosManager from "./_components/VideosManager";
import PdfsManager from "./_components/PdfsManager";
import QuizzesManager from "./_components/QuizzesManager";

export default function CourseContentPage() {
  const params = useParams();
  const router = useRouter();
  const { courseId } = params;
  
  const [activeTab, setActiveTab] = useState("chapters");
  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [videos, setVideos] = useState([]);
  const [pdfs, setPdfs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingQuiz, setEditingQuiz] = useState(null);
  
  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch course details
        const courseResponse = await axios.get(`/api/admin/courses/${courseId}`);
        setCourse(courseResponse.data.course);
        
        // Fetch chapters
        const chaptersResponse = await axios.get(`/api/admin/courses/${courseId}/chapters`);
        if (chaptersResponse.data.success) {
          setChapters(chaptersResponse.data.chapters);
        }
        
        // Fetch videos
        try {
          const videosResponse = await axios.get(`/api/admin/courses/${courseId}/videos`);
          if (videosResponse.data.success) {
            setVideos(videosResponse.data.videos);
          }
        } catch (error) {
          console.log('No videos endpoint or error fetching videos:', error);
        }
        
        // Fetch PDFs
        try {
          const pdfsResponse = await axios.get(`/api/admin/courses/${courseId}/pdfs`);
          if (pdfsResponse.data.success) {
            setPdfs(pdfsResponse.data.pdfs);
          }
        } catch (error) {
          console.log('No PDFs endpoint or error fetching PDFs:', error);
        }
        
        // Fetch quizzes
        try {
          const quizzesResponse = await axios.get(`/api/admin/courses/${courseId}/quizzes`);
          if (quizzesResponse.data.success) {
            setQuizzes(quizzesResponse.data.quizzes);
          }
        } catch (error) {
          console.log('No quizzes endpoint or error fetching quizzes:', error);
        }
      } catch (error) {
        console.error("Error fetching course content:", error);
        setError(error.response?.data?.error || "فشل في تحميل محتوى الكورس. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId]);
  
  // Show error as a notification but don't block the entire page
  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
        <p>{error}</p>
        <button 
          onClick={() => setError(null)} 
          className="text-red-700 hover:text-red-900"
        >
          ×
        </button>
      </div>
    );
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-Olive-600"></div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!course) {
    return (
      <AdminLayout>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>الكورس غير موجود.</p>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-Olive-600 text-white px-4 py-2 rounded-md hover:bg-Olive-700"
        >
          العودة إلى لوحة التحكم
        </button>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="mb-6">
        {renderError()}
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">إدارة محتوى الكورس: {course.title}</h1>
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={() => router.back()}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              العودة
            </button>
            <Link 
              href={`/admin/courses/${courseId}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              عرض تفاصيل الكورس
            </Link>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white dark:bg-midNight-900 shadow-md rounded-lg overflow-hidden">
        <div className="flex border-b">
          <button 
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'chapters' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('chapters')}
          >
            الفصول
          </button>
          <button 
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'videos' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('videos')}
          >
            الفيديوهات
          </button>
          <button 
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'pdfs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('pdfs')}
          >
            الملفات PDF
          </button>
          <button 
            className={`px-6 py-3 text-lg font-medium ${activeTab === 'quizzes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('quizzes')}
          >
            الاختبارات
          </button>
        </div>
        
        <div className="p-6">
          {/* Chapters Tab */}
          {activeTab === 'chapters' && (
            <ChaptersManager 
              courseId={courseId} 
              chapters={chapters} 
              setChapters={setChapters} 
            />
          )}
          
          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <VideosManager 
              courseId={courseId} 
              videos={videos} 
              setVideos={setVideos} 
              chapters={chapters} 
            />
          )}
          
          {/* PDFs Tab */}
          {activeTab === 'pdfs' && (
            <PdfsManager 
              courseId={courseId} 
              pdfs={pdfs} 
              setPdfs={setPdfs} 
              chapters={chapters} 
            />
          )}
          
          {/* Quizzes Tab */}
          {activeTab === 'quizzes' && (
            <>
              {editingQuiz ? (
                <EditQuizForm 
                  quiz={editingQuiz} 
                  onCancel={() => setEditingQuiz(null)} 
                  onSuccess={(updatedQuiz) => {
                    setQuizzes(quizzes.map(q => q._id === updatedQuiz._id ? updatedQuiz : q));
                    setEditingQuiz(null);
                  }}
                  courseId={courseId}
                  chapters={chapters}
                />
              ) : (
                <QuizzesManager 
                  courseId={courseId} 
                  quizzes={quizzes} 
                  setQuizzes={setQuizzes} 
                  chapters={chapters} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
