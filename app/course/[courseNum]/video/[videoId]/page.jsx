"use client"

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import NavBar from "../../../../_components/NavBar";
import axios from "axios";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const VideoPage = () => {
  const params = useParams();
  const { courseNum, videoId } = params;
  
  const [video, setVideo] = useState(null);
  const [course, setCourse] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [navigation, setNavigation] = useState({ previous: null, next: null });
  const [chapters, setChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/videos/${videoId}`);
        setVideo(response.data.video);
        setChapter(response.data.chapter);
        setCourse(response.data.course);
        setNavigation(response.data.navigation);
        
        // Also fetch all chapters to show in sidebar
        const courseResponse = await axios.get(`/api/courses/${courseNum}`);
        setChapters(courseResponse.data.chapters);
        
        // Expand the current chapter
        setExpandedChapter(response.data.chapter._id);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching video data:", err);
        setError("Failed to load video. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (videoId && courseNum) {
      fetchVideoData();
    }
  }, [videoId, courseNum]);

  const toggleChapter = (chapterId) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);
    }
  };

  if (loading) {
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
      
      <div className="container mx-auto px-4 py-[100px]">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Video Player Section */}
          <div className="w-full md:w-2/3">
            <h1 className="text-2xl font-bold mb-4 text-right">{video?.title}</h1>
            
            {/* Video Player */}
            <div className="aspect-video bg-black mb-4 rounded-lg overflow-hidden">
              {video?.videoUrl && (
                <ReactPlayer
                  url={video.videoUrl}
                  width="100%"
                  height="100%"
                  controls
                  playing
                  config={{
                    file: {
                      attributes: {
                        controlsList: 'nodownload',
                        disablePictureInPicture: true,
                      },
                    },
                  }}
                  light={video.thumbnailUrl || "/images/video-thumbnail.jpg"}
                  pip
                  stopOnUnmount
                  className="react-player"
                />
              )}
            </div>
            
            {/* Video Navigation */}
            <div className="flex justify-between mb-6">
              {navigation.previous ? (
                <Link 
                  href={`/course/${courseNum}/video/${navigation.previous._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  الفيديو السابق
                </Link>
              ) : (
                <div></div>
              )}
              
              {navigation.next ? (
                <Link 
                  href={`/course/${courseNum}/video/${navigation.next._id}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  الفيديو التالي
                </Link>
              ) : (
                <div></div>
              )}
            </div>
            
            {/* Video Description */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-right">
              <h2 className="text-xl font-bold mb-2">وصف الفيديو</h2>
              <p>{video?.description || "لا يوجد وصف لهذا الفيديو"}</p>
            </div>
          </div>
          
          {/* Course Content Sidebar */}
          <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4 text-right">محتوى الكورس</h2>
            
            {/* Chapters Accordion */}
            <div className="space-y-4">
              {chapters.length > 0 ? (
                chapters.map((chapterItem) => (
                  <div key={chapterItem._id} className="border rounded-lg overflow-hidden">
                    <div 
                      className={`p-4 cursor-pointer flex justify-between items-center ${
                        chapterItem._id === chapter?._id ? "bg-blue-100" : "bg-gray-100"
                      }`}
                      onClick={() => toggleChapter(chapterItem._id)}
                    >
                      <div className="font-bold">{chapterItem.title}</div>
                      <div className="transform transition-transform duration-200">
                        {expandedChapter === chapterItem._id ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    {expandedChapter === chapterItem._id && (
                      <div className="p-4 bg-white">
                        {/* Videos */}
                        {chapterItem.videos && chapterItem.videos.length > 0 && (
                          <div className="space-y-2">
                            {chapterItem.videos.map((videoItem) => (
                              <Link 
                                href={`/course/${courseNum}/video/${videoItem._id}`}
                                key={videoItem._id}
                              >
                                <div className={`flex items-center p-2 rounded-md ${
                                  videoItem._id === video?._id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                                }`}>
                                  <div className="mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1">{videoItem.title}</div>
                                  <div className="text-sm text-gray-500">
                                    {Math.floor(videoItem.duration / 60)}:{(videoItem.duration % 60).toString().padStart(2, '0')}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                        
                        {/* PDFs */}
                        {chapterItem.pdfs && chapterItem.pdfs.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-bold mb-2 text-sm text-gray-500">ملفات PDF</h3>
                            <div className="space-y-2">
                              {chapterItem.pdfs.map((pdf) => (
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
                        {chapterItem.quizzes && chapterItem.quizzes.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-bold mb-2 text-sm text-gray-500">الاختبارات</h3>
                            <div className="space-y-2">
                              {chapterItem.quizzes.map((quiz) => (
                                <Link 
                                  href={`/course/${courseNum}/quiz/${quiz._id}`}
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
                <p className="text-center py-4 text-gray-500">
                  لا يوجد محتوى متاح لهذا الكورس حالياً
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
