"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function ChaptersManager({ courseId, chapters, setChapters }) {
  const [chapterForm, setChapterForm] = useState({ title: "", description: "", position: 1 });
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChapterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form data
      if (!chapterForm.title.trim()) {
        throw new Error("عنوان الفصل مطلوب");
      }
      
      const response = await axios.post(`/api/admin/courses/${courseId}/chapters`, {
        ...chapterForm,
        courseId
      });
      
      if (response.data.success) {
        // Add the new chapter to the state
        setChapters([...chapters, response.data.chapter]);
        setShowChapterForm(false);
        setChapterForm({ title: "", description: "", position: chapters.length + 1 });
      } else {
        throw new Error(response.data.error || "فشل في إضافة الفصل");
      }
    } catch (error) {
      console.error("Error adding chapter:", error);
      setError(error.response?.data?.error || error.message || "فشل في إضافة الفصل. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
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
        <h2 className="text-xl font-bold">إدارة الفصول</h2>
        <button 
          onClick={() => setShowChapterForm(!showChapterForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {showChapterForm ? 'إلغاء' : 'إضافة فصل جديد'}
        </button>
      </div>
      
      {renderError()}
      
      {showChapterForm && (
        <div className="bg-gray-50 dark:bg-midNight-800 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold mb-4">إضافة فصل جديد</h3>
          <form onSubmit={handleChapterSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="chapterTitle">
                عنوان الفصل
              </label>
              <input
                id="chapterTitle"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={chapterForm.title}
                onChange={(e) => setChapterForm({...chapterForm, title: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="chapterDescription">
                وصف الفصل
              </label>
              <textarea
                id="chapterDescription"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={chapterForm.description}
                onChange={(e) => setChapterForm({...chapterForm, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="chapterPosition">
                الترتيب
              </label>
              <input
                id="chapterPosition"
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={chapterForm.position}
                onChange={(e) => setChapterForm({...chapterForm, position: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ الفصل'}
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowChapterForm(false)}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
      
      {chapters.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-700 dark:text-yellow-400">
          لا توجد فصول حالياً. أضف فصلاً جديداً للبدء.
        </div>
      ) : (
        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div key={chapter._id} className="bg-white dark:bg-midNight-800 border border-gray-200 dark:border-midNight-700 p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{chapter.position}. {chapter.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{chapter.description}</p>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // Edit chapter logic
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 mr-3"
                    onClick={() => {
                      // Delete chapter logic
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
