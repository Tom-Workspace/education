"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import QuestionForm from './QuestionForm';

export default function QuizzesManager({ courseId, quizzes, setQuizzes, chapters }) {
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
  
  // State for managing quiz questions
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctOption: 0,
    points: 1
  });
  
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load quiz data when editing an existing quiz
  useEffect(() => {
    if (editingQuiz) {
      setShowQuizForm(true);
      
      // Load quiz data into form
      setQuizForm({
        title: editingQuiz.title || "",
        description: editingQuiz.description || "",
        chapterId: editingQuiz.chapterId || "",
        timeLimit: editingQuiz.timeLimit || 30,
        position: editingQuiz.position || 1,
        maxAttempts: editingQuiz.maxAttempts || 1,
        allowResume: editingQuiz.allowResume || false,
        passingScore: editingQuiz.passingScore || 70
      });
      
      // Load quiz questions
      const fetchQuizQuestions = async () => {
        try {
          const response = await axios.get(`/api/admin/courses/${courseId}/quizzes/${editingQuiz._id}`);
          if (response.data.success && response.data.questions) {
            // Transform questions to the format expected by the form
            const formattedQuestions = response.data.questions.map(q => ({
              id: q._id,
              question: q.question,
              options: q.options.map(opt => opt.text),
              correctOption: q.options.findIndex(opt => opt.isCorrect),
              points: q.points || 1
            }));
            setQuizQuestions(formattedQuestions);
          }
        } catch (error) {
          console.error('Error fetching quiz questions:', error);
          setError('فشل في تحميل أسئلة الاختبار');
        }
      };
      
      fetchQuizQuestions();
    }
  }, [editingQuiz, courseId]);

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form data
      if (!quizForm.title.trim()) {
        throw new Error("عنوان الاختبار مطلوب");
      }
      
      if (!quizForm.chapterId) {
        throw new Error("يجب اختيار الفصل");
      }
      
      if (quizQuestions.length === 0) {
        throw new Error("يجب إضافة سؤال واحد على الأقل");
      }
      
      console.log("Submitting quiz:", { ...quizForm, questions: quizQuestions });
      
      let response;
      
      if (editingQuiz) {
        // Update existing quiz
        response = await axios.put(`/api/admin/courses/${courseId}/quizzes/${editingQuiz._id}`, {
          ...quizForm,
          questions: quizQuestions,
          courseId
        });
        
        console.log("Quiz update response:", response.data);
        
        if (response.data.success) {
          // Update the quizzes array with the updated quiz
          const updatedQuizzes = quizzes.map(q => 
            q._id === editingQuiz._id ? response.data.quiz : q
          );
          setQuizzes(updatedQuizzes);
          setEditingQuiz(null);
        } else {
          throw new Error(response.data.error || "فشل في تحديث الاختبار");
        }
      } else {
        // Create new quiz
        response = await axios.post(`/api/admin/courses/${courseId}/quizzes`, {
          ...quizForm,
          questions: quizQuestions,
          courseId
        });
        
        console.log("Quiz creation response:", response.data);
        
        if (response.data.success) {
          setQuizzes([...quizzes, response.data.quiz]);
        } else {
          throw new Error(response.data.error || "فشل في إضافة الاختبار");
        }
      }
      
      // Reset form state after successful submission
      if (response.data.success) {
        setShowQuizForm(false);
        setQuizForm({ 
          title: "", 
          description: "", 
          chapterId: "",
          timeLimit: 30,
          position: quizzes.length + 1,
          maxAttempts: 1,
          allowResume: false,
          passingScore: 70,
          questions: []
        });
        setQuizQuestions([]);
      }
    } catch (error) {
      console.error(editingQuiz ? "Error updating quiz:" : "Error adding quiz:", error);
      setError(error.response?.data?.error || error.message || (editingQuiz ? "فشل في تعديل الاختبار. يرجى المحاولة مرة أخرى." : "فشل في إضافة الاختبار. يرجى المحاولة مرة أخرى."));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const addQuestionToQuiz = () => {
    if (!currentQuestion.question.trim()) {
      setError("يرجى إدخال نص السؤال");
      return;
    }
    
    if (currentQuestion.options.some(option => !option.trim())) {
      setError("يرجى إدخال جميع الخيارات");
      return;
    }
    
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updatedQuestions = [...quizQuestions];
      updatedQuestions[editingQuestionIndex] = {...currentQuestion, id: quizQuestions[editingQuestionIndex].id};
      setQuizQuestions(updatedQuestions);
      setEditingQuestionIndex(null);
    } else {
      // Add new question
      const newQuestions = [...quizQuestions, {...currentQuestion, id: Date.now()}];
      setQuizQuestions(newQuestions);
    }
    
    // Reset current question form
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctOption: 0,
      points: 1
    });
    
    setShowQuestionForm(false);
  };
  
  const handleEditQuestion = (index) => {
    setCurrentQuestion({...quizQuestions[index]});
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
  };
  
  const removeQuestion = (index) => {
    const updatedQuestions = [...quizQuestions];
    updatedQuestions.splice(index, 1);
    setQuizQuestions(updatedQuestions);
  };
  
  const handleOptionChange = (index, value) => {
    const updatedOptions = [...currentQuestion.options];
    updatedOptions[index] = value;
    setCurrentQuestion({...currentQuestion, options: updatedOptions});
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
        <h2 className="text-xl font-bold">إدارة الاختبارات</h2>
        <button 
          onClick={() => {
            setShowQuizForm(!showQuizForm);
            if (editingQuiz) setEditingQuiz(null);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          disabled={editingQuiz !== null}
        >
          {showQuizForm ? 'إلغاء' : 'إضافة اختبار جديد'}
        </button>
      </div>
      
      {renderError()}
      
      {showQuizForm && (
        <div className="bg-gray-50 dark:bg-midNight-800 p-4 rounded-md mb-6">
          <h3 className="text-lg font-semibold mb-4">{editingQuiz ? 'تعديل الاختبار' : 'إضافة اختبار جديد'}</h3>
          <form onSubmit={handleQuizSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="quizTitle">
                عنوان الاختبار
              </label>
              <input
                id="quizTitle"
                type="text"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={quizForm.title}
                onChange={(e) => setQuizForm({...quizForm, title: e.target.value})}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="quizDescription">
                وصف الاختبار
              </label>
              <textarea
                id="quizDescription"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={quizForm.description}
                onChange={(e) => setQuizForm({...quizForm, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="quizChapter">
                الفصل
              </label>
              <select
                id="quizChapter"
                className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                value={quizForm.chapterId}
                onChange={(e) => setQuizForm({...quizForm, chapterId: e.target.value})}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="quizTimeLimit">
                  الوقت المحدد (دقائق)
                </label>
                <input
                  id="quizTimeLimit"
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                  value={quizForm.timeLimit}
                  onChange={(e) => setQuizForm({...quizForm, timeLimit: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="quizPosition">
                  الترتيب
                </label>
                <input
                  id="quizPosition"
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                  value={quizForm.position}
                  onChange={(e) => setQuizForm({...quizForm, position: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="quizMaxAttempts">
                  عدد المحاولات المسموح بها
                </label>
                <input
                  id="quizMaxAttempts"
                  type="number"
                  min="1"
                  className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                  value={quizForm.maxAttempts}
                  onChange={(e) => setQuizForm({...quizForm, maxAttempts: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="quizPassingScore">
                  درجة النجاح (%)
                </label>
                <input
                  id="quizPassingScore"
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                  value={quizForm.passingScore}
                  onChange={(e) => setQuizForm({...quizForm, passingScore: parseInt(e.target.value)})}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  id="quizAllowResume"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={quizForm.allowResume}
                  onChange={(e) => setQuizForm({...quizForm, allowResume: e.target.checked})}
                />
                <label htmlFor="quizAllowResume" className="mr-2 block text-gray-700 dark:text-gray-300">
                  السماح بالخروج من الاختبار وتكملته لاحقاً
                </label>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-6 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold">أسئلة الاختبار</h4>
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  onClick={() => {
                    setShowQuestionForm(true);
                    setEditingQuestionIndex(null);
                    setCurrentQuestion({
                      question: "",
                      options: ["", "", "", ""],
                      correctOption: 0,
                      points: 1
                    });
                  }}
                >
                  إضافة سؤال جديد
                </button>
              </div>
              
              {showQuestionForm && (
                <div className="bg-white dark:bg-midNight-700 p-4 rounded-md mb-4 border border-gray-200 dark:border-gray-600">
                  <h5 className="font-semibold mb-3">
                    {editingQuestionIndex !== null ? 'تعديل السؤال' : 'إضافة سؤال جديد'}
                  </h5>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="questionText">
                      نص السؤال
                    </label>
                    <textarea
                      id="questionText"
                      className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                      rows="2"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      الخيارات
                    </label>
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="radio"
                          id={`option-${index}`}
                          name="correctOption"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          checked={currentQuestion.correctOption === index}
                          onChange={() => setCurrentQuestion({...currentQuestion, correctOption: index})}
                        />
                        <label htmlFor={`option-${index}`} className="mr-2 text-gray-700 dark:text-gray-300 w-20">
                          {index === 0 ? 'الإجابة الصحيحة:' : `الخيار ${index + 1}:`}
                        </label>
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          required
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="questionPoints">
                      النقاط
                    </label>
                    <input
                      id="questionPoints"
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 border rounded-md dark:bg-midNight-700 dark:border-midNight-600"
                      value={currentQuestion.points}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, points: parseInt(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                      onClick={addQuestionToQuiz}
                    >
                      {editingQuestionIndex !== null ? 'تحديث السؤال' : 'إضافة السؤال'}
                    </button>
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                      onClick={() => {
                        setShowQuestionForm(false);
                        setEditingQuestionIndex(null);
                      }}
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
              
              {/* Questions list */}
              {quizQuestions.length > 0 ? (
                <div className="mb-6">
                  <h5 className="font-semibold mb-2">الأسئلة المضافة ({quizQuestions.length})</h5>
                  <div className="grid grid-cols-1 gap-4 mt-3">
                    {quizQuestions.map((question, index) => (
                      <div key={index} className="p-4 bg-white dark:bg-midNight-800 rounded-lg shadow-md">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 dark:text-gray-100 mb-2">السؤال {index + 1}: {question.question}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              <ul className="list-disc me-4 space-y-1">
                                {question.options.map((option, optIndex) => (
                                  <li key={optIndex} className={optIndex === question.correctOption ? 'text-green-600 dark:text-green-400 font-medium' : ''}>
                                    {option} {optIndex === question.correctOption && '(الإجابة الصحيحة)'}
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-2">النقاط: {question.points}</div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              type="button"
                              onClick={() => handleEditQuestion(index)}
                              className="text-blue-600 hover:text-blue-800 border border-blue-600 rounded-md px-2 py-1 mx-1"
                            >
                              تعديل
                            </button>
                            <button 
                              type="button"
                              onClick={() => removeQuestion(index)}
                              className="text-red-600 hover:text-red-800 border border-red-600 rounded-md px-2 py-1 mx-1"
                            >
                              حذف
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-700 dark:text-yellow-400 mb-4">
                  لم تتم إضافة أي أسئلة بعد. أضف سؤالاً جديداً للبدء.
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2"
                disabled={isSubmitting || quizQuestions.length === 0}
              >
                {isSubmitting ? 'جاري الحفظ...' : (editingQuiz ? 'تحديث الاختبار' : 'حفظ الاختبار')}
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                onClick={() => {
                  setShowQuizForm(false);
                  setQuizQuestions([]);
                  setEditingQuiz(null);
                }}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}
      
      {quizzes.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md text-yellow-700 dark:text-yellow-400">
          لا توجد اختبارات حالياً. أضف اختباراً جديداً للبدء.
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-white dark:bg-midNight-800 border border-gray-200 dark:border-midNight-700 p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{quiz.position}. {quiz.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{quiz.description}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {quiz.timeLimit > 0 ? `الوقت: ${quiz.timeLimit} دقيقة` : "لا يوجد وقت محدد"} | 
                    الحد الأقصى للمحاولات: {quiz.maxAttempts || 1} | 
                    درجة النجاح: {quiz.passingScore}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    عدد الأسئلة: {quiz.questions?.length || 0}
                  </div>
                </div>
                <div className="flex space-x-2 space-x-reverse">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setEditingQuiz(quiz);
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 mr-3"
                    onClick={async () => {
                      if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا الاختبار؟')) {
                        try {
                          setIsSubmitting(true);
                          setError(null);
                          
                          const response = await axios.delete(`/api/admin/courses/${courseId}/quizzes/${quiz._id}`);
                          
                          if (response.data.success) {
                            // Remove the deleted quiz from the state
                            setQuizzes(quizzes.filter(q => q._id !== quiz._id));
                          } else {
                            throw new Error(response.data.error || 'فشل في حذف الاختبار');
                          }
                        } catch (error) {
                          console.error('Error deleting quiz:', error);
                          setError(error.response?.data?.error || error.message || 'فشل في حذف الاختبار. يرجى المحاولة مرة أخرى.');
                        } finally {
                          setIsSubmitting(false);
                        }
                      }
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
