"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function VideosManager({ courseId, videos, setVideos, chapters }) {
  const [videoForm, setVideoForm] = useState({ 
    title: "", 
    description: "", 
    videoUrl: "", 
    chapterId: "",
    duration: 0,
    position: 1
  });
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to update course metrics after any video operation (add/edit/delete)
  const updateCourseMetrics = async () => {
    try {
      // Call the metrics update endpoint
      await axios.get(`/api/courses/${courseId}/update-metrics`);
      console.log('Course metrics updated successfully');
    } catch (error) {
      console.error('Error updating course metrics:', error);
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form data
      if (!videoForm.title.trim()) {
        throw new Error("عنوان الفيديو مطلوب");
      }
      
      if (!videoForm.videoUrl.trim()) {
        throw new Error("رابط الفيديو مطلوب");
      }
      
      if (!videoForm.chapterId) {
        throw new Error("يجب اختيار الفصل");
      }
      
      console.log("Submitting video:", videoForm);
      
      const response = await axios.post(`/api/admin/courses/${courseId}/videos`, {
        ...videoForm,
        courseId
      });
      
      console.log("Video response:", response.data);
      
      if (response.data.success) {
        setVideos([...videos, response.data.video]);
        setShowVideoForm(false);
        setVideoForm({ 
          title: "", 
          description: "", 
          videoUrl: "", 
          chapterId: "",
          duration: 0,
          position: videos.length + 1
        });
        
        // Update course metrics after adding a video
        await updateCourseMetrics();
      } else {
        throw new Error(response.data.error || "فشل في إضافة الفيديو");
      }
    } catch (error) {
      console.error("Error adding video:", error);
      setError(error.response?.data?.error || error.message || "فشل في إضافة الفيديو. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الفيديو؟")) {
      return;
    }
    
    try {
      const response = await axios.delete(`/api/admin/courses/${courseId}/videos/${videoId}`);
      
      if (response.data.success) {
        setVideos(videos.filter(v => v._id !== videoId));
        
        // Update course metrics after deleting a video
        await updateCourseMetrics();
      } else {
        setError(response.data.error || "فشل في حذف الفيديو");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      setError(error.response?.data?.error || error.message || "فشل في حذف الفيديو. يرجى المحاولة مرة أخرى.");
    }
  };

  // Show error as a notification
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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">إدارة الفيديوهات</h2>
        <button 
          onClick={() => setShowVideoForm(!showVideoForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {showVideoForm ? 'إلغاء' : 'إضافة فيديو جديد'}
        </button>
      </div>
      
      {renderError()}
      
      {showVideoForm && (
        <div className="bg-gray-50 dark:bg-midNight-800 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold mb-4">إضافة فيديو جديد</h3>
          <form onSubmit={handleVideoSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="videoTitle">
                عنوان الفيديو
              </label>
              <input
                id="videoTitle"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={videoForm.title}
                onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="videoDescription">
                وصف الفيديو
              </label>
              <textarea
                id="videoDescription"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={videoForm.description}
                onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="videoUrl">
                رابط الفيديو
              </label>
              <input
                id="videoUrl"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={videoForm.videoUrl}
                onChange={(e) => setVideoForm({...videoForm, videoUrl: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="videoDuration">
                مدة الفيديو (بالدقائق)
              </label>
              <input
                id="videoDuration"
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={videoForm.duration}
                onChange={(e) => setVideoForm({...videoForm, duration: parseFloat(e.target.value)})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="videoChapter">
                الفصل
              </label>
              <select
                id="videoChapter"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={videoForm.chapterId}
                onChange={(e) => setVideoForm({...videoForm, chapterId: e.target.value})}
                required
              >
                <option value="">-- اختر الفصل --</option>
                {chapters.map((chapter) => (
                  <option key={chapter._id} value={chapter._id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="videoPosition">
                الترتيب
              </label>
              <input
                id="videoPosition"
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={videoForm.position}
                onChange={(e) => setVideoForm({...videoForm, position: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ الفيديو'}
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowVideoForm(false)}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
      
      {videos.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-700 dark:text-yellow-400">
          لا توجد فيديوهات حالياً. أضف فيديو جديد للبدء.
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <div key={video._id} className="bg-white dark:bg-midNight-800 border border-gray-200 dark:border-midNight-700 p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{video.position}. {video.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{video.description}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    المدة: {video.duration} دقيقة
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // Edit video logic
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 mr-3"
                    onClick={() => {
                      // Delete video logic
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
