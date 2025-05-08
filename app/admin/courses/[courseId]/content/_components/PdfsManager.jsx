"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function PdfsManager({ courseId, pdfs, setPdfs, chapters }) {
  const [pdfForm, setPdfForm] = useState({ 
    title: "", 
    description: "", 
    file: null,
    pdfUrl: "",
    chapterId: "",
    position: 1
  });
  const [pdfFileName, setPdfFileName] = useState("");
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handlePdfSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form data
      if (!pdfForm.title.trim()) {
        throw new Error("عنوان الملف مطلوب");
      }
      
      if (!pdfForm.chapterId) {
        throw new Error("يجب اختيار الفصل");
      }
      
      if (!pdfForm.pdfUrl && !pdfForm.file) {
        throw new Error("يرجى اختيار ملف PDF أو تحديد رابط");
      }
      
      console.log("Submitting PDF:", pdfForm);
      
      let response;
      
      if (pdfForm.file) {
        const formData = new FormData();
        formData.append("file", pdfForm.file);
        formData.append("title", pdfForm.title);
        formData.append("description", pdfForm.description);
        formData.append("chapterId", pdfForm.chapterId);
        formData.append("position", pdfForm.position);
        formData.append("courseId", courseId);
        
        response = await axios.post(`/api/admin/courses/${courseId}/pdfs`, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      } else {
        // If we already have a URL from previous upload
        response = await axios.post(`/api/admin/courses/${courseId}/pdfs`, {
          ...pdfForm,
          courseId
        });
      }
      
      console.log("PDF response:", response.data);
      
      if (response.data.success) {
        setPdfs([...pdfs, response.data.pdf]);
        setShowPdfForm(false);
        setPdfForm({ 
          title: "", 
          description: "", 
          file: null, 
          pdfUrl: "",
          chapterId: "",
          position: pdfs.length + 1
        });
        setPdfFileName("");
      } else {
        throw new Error(response.data.error || "فشل في إضافة الملف");
      }
    } catch (error) {
      console.error("Error adding PDF:", error);
      setError(error.response?.data?.error || error.message || "فشل في إضافة الملف. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePdfFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== "application/pdf") {
      setError("يرجى اختيار ملف بصيغة PDF فقط");
      return;
    }

    try {
      setPdfUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'pdf');
      
      const response = await axios.post('/api/admin/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      
      console.log('PDF uploaded successfully:', response.data);
      setPdfForm({...pdfForm, pdfUrl: response.data.url, file: file});
      setPdfFileName(file.name);
      
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError('فشل في رفع الملف. يرجى المحاولة مرة أخرى.');
    } finally {
      setPdfUploading(false);
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
        <h2 className="text-xl font-bold">إدارة ملفات PDF</h2>
        <button 
          onClick={() => setShowPdfForm(!showPdfForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          {showPdfForm ? 'إلغاء' : 'إضافة ملف PDF جديد'}
        </button>
      </div>
      
      {renderError()}
      
      {showPdfForm && (
        <div className="bg-gray-50 dark:bg-midNight-800 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold mb-4">إضافة ملف PDF جديد</h3>
          <form onSubmit={handlePdfSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="pdfTitle">
                عنوان الملف
              </label>
              <input
                id="pdfTitle"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={pdfForm.title}
                onChange={(e) => setPdfForm({...pdfForm, title: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="pdfDescription">
                وصف الملف
              </label>
              <textarea
                id="pdfDescription"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={pdfForm.description}
                onChange={(e) => setPdfForm({...pdfForm, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="pdfFile">
                ملف PDF
              </label>
              <div className="flex items-center">
                <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                  <span>اختر ملف</span>
                  <input
                    id="pdfFile"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handlePdfFileChange}
                  />
                </label>
                {pdfFileName && (
                  <span className="mr-3 text-gray-700 dark:text-gray-300">{pdfFileName}</span>
                )}
              </div>
              
              {pdfUploading && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">جاري الرفع: {uploadProgress}%</p>
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="pdfChapter">
                الفصل
              </label>
              <select
                id="pdfChapter"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={pdfForm.chapterId}
                onChange={(e) => setPdfForm({...pdfForm, chapterId: e.target.value})}
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
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="pdfPosition">
                الترتيب
              </label>
              <input
                id="pdfPosition"
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={pdfForm.position}
                onChange={(e) => setPdfForm({...pdfForm, position: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                disabled={isSubmitting || pdfUploading}
              >
                {isSubmitting ? 'جاري الحفظ...' : 'حفظ الملف'}
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => setShowPdfForm(false)}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
      
      {pdfs.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-700 dark:text-yellow-400">
          لا توجد ملفات PDF حالياً. أضف ملفاً جديداً للبدء.
        </div>
      ) : (
        <div className="space-y-4">
          {pdfs.map((pdf) => (
            <div key={pdf._id} className="bg-white dark:bg-midNight-800 border border-gray-200 dark:border-midNight-700 p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{pdf.position}. {pdf.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{pdf.description}</p>
                  {pdf.pdfUrl && (
                    <a 
                      href={pdf.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                    >
                      عرض الملف
                    </a>
                  )}
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      // Edit PDF logic
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 mr-3"
                    onClick={() => {
                      // Delete PDF logic
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
