"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaEdit } from 'react-icons/fa';

const EditQuizForm = ({ quiz, onCancel, onSuccess, courseId, chapters }) => {
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    chapterId: "",
    timeLimit: 30,
    position: 1,
    maxAttempts: 1,
    allowResume: false,
    passingScore: 70,
    questions: []
  });

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOption: 0,
    points: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quiz) {
      setLoading(true);
      // Fetch the quiz details including questions
      axios.get(`/api/admin/courses/${courseId}/quizzes/${quiz._id}`)
        .then(response => {
          if (response.data.success) {
            const { quiz: quizData, questions } = response.data;
            
            // Format the questions for the form
            const formattedQuestions = questions.map(q => ({
              id: q._id,
              question: q.question,
              options: q.options.map(opt => opt.text),
              correctOption: q.options.findIndex(opt => opt.isCorrect),
              points: q.points || 1,
              position: q.position || 0
            }));
            
            setQuizForm({
              title: quizData.title,
              description: quizData.description || "",
              chapterId: quizData.chapterId,
              timeLimit: quizData.timeLimit || 30,
              position: quizData.position || 1,
              maxAttempts: quizData.maxAttempts || 1,
              allowResume: quizData.allowResume || false,
              passingScore: quizData.passingScore || 70,
              questions: formattedQuestions
            });
            
            setQuizQuestions(formattedQuestions);
          } else {
            setError(response.data.error || "Failed to load quiz details");
          }
        })
        .catch(err => {
          console.error("Error loading quiz:", err);
          setError(err.response?.data?.error || err.message || "Failed to load quiz details");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [quiz, courseId]);

  const addQuestionToQuiz = () => {
    if (!currentQuestion.question.trim()) {
      setError("Please enter the question text");
      return;
    }
    
    if (currentQuestion.options.some(option => !option.trim())) {
      setError("Please enter all options");
      return;
    }
    
    const newQuestions = [...quizQuestions, {...currentQuestion, id: Date.now()}];
    setQuizQuestions(newQuestions);
    setQuizForm({...quizForm, questions: newQuestions});
    
    // Reset current question form
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctOption: 0,
      points: 1
    });
  };
  
  const removeQuestion = (questionId) => {
    const updatedQuestions = quizQuestions.filter(q => q.id !== questionId);
    setQuizQuestions(updatedQuestions);
    setQuizForm({...quizForm, questions: updatedQuestions});
  };
  
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({...currentQuestion, options: updatedOptions});
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form data
      if (!quizForm.title.trim()) {
        throw new Error("Quiz title is required");
      }
      
      if (!quizForm.chapterId) {
        throw new Error("Please select a chapter");
      }
      
      if (quizQuestions.length === 0) {
        throw new Error("Please add at least one question");
      }
      
      console.log("Updating quiz:", { ...quizForm, questions: quizQuestions });
      
      const response = await axios.put(`/api/admin/courses/${courseId}/quizzes/${quiz._id}`, {
        ...quizForm,
        questions: quizQuestions,
        courseId
      });
      
      console.log("Quiz update response:", response.data);
      
      if (response.data.success) {
        onSuccess(response.data.quiz);
      } else {
        throw new Error(response.data.error || "Failed to update quiz");
      }
    } catch (error) {
      console.error("Error updating quiz:", error);
      setError(error.response?.data?.error || error.message || "Failed to update quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-midNight-800 rounded-lg shadow-md">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-midNight-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-right">تعديل الاختبار</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-right">
          {error}
        </div>
      )}
      
      <form onSubmit={handleQuizSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right" htmlFor="quizTitle">
                عنوان الاختبار
              </label>
              <input
                id="quizTitle"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600 text-right"
                value={quizForm.title}
                onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                required
                dir="rtl"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right" htmlFor="quizChapter">
                الفصل
              </label>
              <select
                id="quizChapter"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600 text-right"
                value={quizForm.chapterId}
                onChange={(e) => setQuizForm({...quizForm, chapterId: e.target.value})}
                required
                dir="rtl"
              >
                <option value="">اختر الفصل</option>
                {chapters.map(chapter => (
                  <option key={chapter._id} value={chapter._id}>
                    {chapter.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right" htmlFor="quizDescription">
              وصف الاختبار
            </label>
            <textarea
              id="quizDescription"
              className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600 text-right"
              value={quizForm.description}
              onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
              rows={3}
              dir="rtl"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right" htmlFor="quizTimeLimit">
                الوقت المحدد (بالدقائق)
              </label>
              <input
                id="quizTimeLimit"
                type="number"
                min="0"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600 text-right"
                value={quizForm.timeLimit}
                onChange={(e) => setQuizForm({...quizForm, timeLimit: parseInt(e.target.value) || 0})}
                dir="rtl"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right" htmlFor="quizMaxAttempts">
                الحد الأقصى للمحاولات
              </label>
              <input
                id="quizMaxAttempts"
                type="number"
                min="1"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600 text-right"
                value={quizForm.maxAttempts}
                onChange={(e) => setQuizForm({...quizForm, maxAttempts: parseInt(e.target.value) || 1})}
                dir="rtl"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right" htmlFor="quizPassingScore">
                درجة النجاح (%)
              </label>
              <input
                id="quizPassingScore"
                type="number"
                min="0"
                max="100"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600 text-right"
                value={quizForm.passingScore}
                onChange={(e) => setQuizForm({...quizForm, passingScore: parseInt(e.target.value) || 0})}
                dir="rtl"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-right">الأسئلة</h3>
            
            {/* Questions List */}
            {quizQuestions.length > 0 ? (
              <div className="space-y-4 mb-6">
                {quizQuestions.map((q, qIndex) => (
                  <div key={q.id} className="p-4 border rounded-md dark:border-midNight-600">
                    <div className="flex justify-between items-start mb-2">
                      <button 
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                      <h4 className="font-semibold text-right">{qIndex + 1}. {q.question}</h4>
                    </div>
                    
                    <div className="space-y-2 mt-2">
                      {q.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center justify-end space-x-2 space-x-reverse">
                          <span className="text-right">{option}</span>
                          {oIndex === q.correctOption && (
                            <span className="text-green-500 ml-2">
                              <FaCheck />
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                لا توجد أسئلة بعد. أضف سؤالاً أدناه.
              </div>
            )}
            
            {/* Add New Question Form */}
            <div className="p-4 border rounded-md dark:border-midNight-600">
              <h4 className="font-semibold mb-4 text-right">إضافة سؤال جديد</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right">
                    نص السؤال
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600 text-right"
                    value={currentQuestion.question}
                    onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                    dir="rtl"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 text-right">
                    الخيارات
                  </label>
                  
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center mb-2 space-x-2 space-x-reverse">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600 text-right"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`الخيار ${index + 1}`}
                        dir="rtl"
                      />
                      
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={currentQuestion.correctOption === index}
                          onChange={() => setCurrentQuestion({...currentQuestion, correctOption: index})}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">صحيح</span>
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addQuestionToQuiz}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    إضافة السؤال
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 flex items-center"
              disabled={isSubmitting}
            >
              <FaTimes className="mr-2" />
              إلغاء
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                  جاري الحفظ...
                </span>
              ) : (
                <>
                  <FaEdit className="mr-2" />
                  حفظ التغييرات
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditQuizForm;
